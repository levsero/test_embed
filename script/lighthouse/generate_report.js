/* eslint no-console:0 */

const exec = require('child_process').execSync
const parseCommit = require('git-parse-commit')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const lighthouseConfig = require('./lighthouse.config')

// Don't go earlier than Git tag 1800 - everything before then just errors out
const EARLIEST_GIT_TAG_VERSION = 3000
const baseURL = 'https://www.cloista.com/web_widget/all_embeds'
// const baseURL = 'https://www.cloista.com/web_widget/support_and_chat'
// const baseURL = 'https://www.cloista.com/web_widget/support_only'

const results = []

const lighthouseOptions = {
  chromeFlags: ['--show-paint-rects']
}

const csvHeaderRows = [
  { id: 'releaseTag', title: 'Release Tag' },
  { id: 'commitAuthor', title: 'Commit author' },
  { id: 'commitDate', title: 'Commit date' },
  { id: 'releaseURL', title: 'Test URL' }
]

const execute = (command, callback) => {
  callback(exec(command).toString('utf8'))
}

const canBenchmarkGitVersion = gitTag => {
  const gitTagNumber = parseInt(gitTag.replace(/\D/g, ''), 10)
  if (isNaN(gitTagNumber)) return false
  if (gitTagNumber >= EARLIEST_GIT_TAG_VERSION && gitTagNumber % 10 == 0) {
    return true
  }
  return false
}

const webWidgetBenchmarkURL = gitTag => {
  let gitTagSHA = null
  execute(`git rev-parse ${gitTag}`, gitSHA => {
    gitTagSHA = gitSHA
  })
  return `${baseURL}?__zE_ac_version=web_widget/${gitTagSHA}`
}

const gitCommitInfo = gitTag => {
  let gitCommit = null

  execute(`git rev-parse ${gitTag}`, gitCommitSHA => {
    execute(`git cat-file -p ${gitCommitSHA}`, rawGitCommitInfo => {
      gitCommit = parseCommit(rawGitCommitInfo)
    })
  })

  return gitCommit
}

async function launchChromeAndRunLighthouse(url, lighthouseOptions, config = null) {
  return chromeLauncher.launch({ chromeFlags: lighthouseOptions.chromeFlags }).then(chrome => {
    lighthouseOptions.port = chrome.port
    return lighthouse(url, lighthouseOptions, config).then(results => {
      // use results.lhr for the JS-consumeable output
      // https://github.com/GoogleChrome/lighthouse/blob/master/types/lhr.d.ts
      // use results.report for the HTML/JSON/CSV output as a string
      // use results.artifacts for the trace/screenshots/other specific case you need (rarer)
      return chrome.kill().then(() => results.lhr)
    })
  })
}

function benchmarkableGitTags() {
  const gitTags = []
  execute('git tag -l | sort -V', sortedGitTags => {
    sortedGitTags.split(/\r?\n/).forEach(gitTag => {
      if (canBenchmarkGitVersion(gitTag)) {
        gitTags.push(gitTag)
      }
    })
  })
  return gitTags
}

// Gross hack but allows other 'audits' to be added + removed from lighthouse config
// and they'll just appear in the output report
let isFirstRecord = true

function runReleaseAgainstLighthouse(gitTag) {
  return new Promise(resolve => {
    const lighthouseResults = {}
    const releaseURL = webWidgetBenchmarkURL(gitTag).trim()
    launchChromeAndRunLighthouse(releaseURL, lighthouseOptions, lighthouseConfig).then(
      ({ audits, categories }) => {
        if (isFirstRecord) {
          Object.keys(audits).forEach(auditKey => {
            csvHeaderRows.push({ id: auditKey, title: audits[auditKey].title })
          })
          Object.keys(categories).forEach(categoryKey => {
            csvHeaderRows.push({ id: categoryKey, title: categories[categoryKey].title })
          })
          isFirstRecord = false
        }
        Object.keys(audits).forEach(auditKey => {
          lighthouseResults[auditKey] = audits[auditKey].numericValue
        })
        Object.keys(categories).forEach(categoryKey => {
          lighthouseResults[categoryKey] = categories[categoryKey].score
        })

        resolve({ gitTag, releaseURL, lighthouseResults })
      }
    )
  })
}

const writeResultsToCSV = () => {
  const reportWriter = createCsvWriter({
    path: './lighthouse_report.csv',
    header: csvHeaderRows
  })

  reportWriter.writeRecords(results).then(() => console.log('report complete'))
}

function executeSequentially(gitTagsArray) {
  return runReleaseAgainstLighthouse(gitTagsArray.shift()).then(
    ({ gitTag, releaseURL, lighthouseResults }) => {
      const commitInfo = gitCommitInfo(gitTag)

      const gitReleaseInfo = {
        releaseTag: gitTag,
        commitAuthor: commitInfo['author']['email'],
        commitDate: new Date(commitInfo['author']['timestamp'] * 1000).toISOString(),
        releaseURL: releaseURL
      }

      console.log('Result: ', { ...gitReleaseInfo, ...lighthouseResults })
      results.push({ ...gitReleaseInfo, ...lighthouseResults })

      if (gitTagsArray.length == 0) {
        writeResultsToCSV()
      } else {
        executeSequentially(gitTagsArray)
      }
    }
  )
}

executeSequentially(benchmarkableGitTags())
