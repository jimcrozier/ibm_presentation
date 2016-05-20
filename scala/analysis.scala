
import sqlContext.implicits._
import org.apache.spark.mllib.regression.LinearRegressionWithSGD
import org.apache.spark.mllib.regression.LabeledPoint
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.ml.feature.{OneHotEncoder, StringIndexer}
import org.apache.spark.mllib.linalg.{Vector, Vectors}
import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.sql.Row
import org.apache.spark.ml.feature.VectorAssembler

val df = sqlContext.read.parquet("hdfs://ec2-54-92-154-38.compute-1.amazonaws.com:9000/user/hive/warehouse/testthis/*")

df.printSchema()

parquetFile.registerTempTable("test")
%sql 
select dt, count(1)
from test 
group by dt 
order by dt

val assembler = new VectorAssembler()
  .setInputCols(Array("cost"))
    .setOutputCol("features")
val transformed = assembler.transform(df)

val parsed = transformed.select(col("rev").alias("label"), col("features"))
val lp = parsed.map(row => LabeledPoint(row.getDouble(11), row.features))
