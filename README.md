# ibm_presentation

To run download spark http://spark.apache.org/downloads.html pre-compiled, navigate to /ec2 folder, and generate spark cluster with 

export AWS_ACCESS_KEY_ID=AKIA....
export AWS_SECRET_ACCESS_KEY=xtp...

./spark-ec2 \
--key-pair=spark \
--identity-file=/.../.ssh/spark.pem \
--region=us-east-1 \
-s 3 \
--instance-type=m3.xlarge \
launch test19

where the access keys and pem are downloaded from you AWS account. 

After the cluster is set up login to the box
./spark-ec2 -k spark -i /Users/robertcrozier/Documents/.ssh/spark.pem --region=us-east-1 login test19

clone this repo

