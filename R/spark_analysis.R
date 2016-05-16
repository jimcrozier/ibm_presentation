library(RODBC)
conn <- odbcConnect("MYSQL", uid= "root")
library(RMySQL)
mydb = dbConnect(MySQL(), user='root',host='localhost', dbname= 'anchor')

library("magrittr")
spark_link <- system('cat /root/spark-ec2/cluster-url', intern=TRUE)
.libPaths(c(.libPaths(), '/root/spark/R/lib'))
Sys.setenv(SPARK_HOME = '/root/spark')
Sys.setenv(PATH = paste(Sys.getenv(c('PATH')), '/root/spark/bin', sep=':'))
library(SparkR)
sc <- sparkR.init(spark_link)
sqlContext <- sparkRSQL.init(sc)

ddf2 <- createDataFrame(sqlContext, testthis)
head(ddf2)
local_df <- ddf2 %>%
  groupBy(ddf2$customer_id) %>%
  summarize(rev = sum(ddf2$rev), qnty = sum(ddf2$qnty)) %>%
  collect
model = glm(qnty ~ price, family = "gaussian", data = ddf3)
summary(model)