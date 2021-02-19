import { StyledSkeleton } from './styles'

const LoadingBarContent = () => {
  return (
    <>
      <StyledSkeleton width="50%" />
      <StyledSkeleton />
      <StyledSkeleton />
      <StyledSkeleton />
      <StyledSkeleton />
    </>
  )
}

export default LoadingBarContent
