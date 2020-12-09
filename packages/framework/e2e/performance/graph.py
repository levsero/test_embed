import matplotlib.pyplot as plt
 
file = open('./e2e/performance/results.csv') 
values = [list(map(lambda x: float(x), line.strip().split(','))) for line in file]

plt.boxplot(values, sym='')
plt.ylabel('ms')
plt.savefig('./e2e/performance/boxplot.png')
