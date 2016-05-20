# ibm_presentation

This repo is for deploying a spark cluster from the spark distro (with R, Rstudio), and adding in mongo, mysql, zeppelin, nodejs, hive and many of the bindings that are needed for tying all of these tools together. It also includes adminlte (https://github.com/RamEduard/admin-lte-express) with some ajax bindings for interacting with the mysql database. 

Code takes about 30 minutes to deploy and setup. 


To run download spark http://spark.apache.org/downloads.html pre-compiled, navigate to /ec2 folder, and generate spark cluster with 
```
export AWS_ACCESS_KEY_ID=AKIA.... 
export AWS_SECRET_ACCESS_KEY=xtp... 
./spark-ec2 \
--key-pair=spark \
--identity-file=/WHERE_YOUR_PEM_IS_LOCATED/spark.pem \
--region=us-east-1 \
-s 3 \
--instance-type=m3.xlarge \
launch test19
```
where the access keys and pem are downloaded from your AWS account (notice this will cost you money, also notice that you can choose any instance type that you want, or even run spot instances). 

After the cluster is set up login to the box
```
./spark-ec2 -k spark -i /WHERE_YOUR_PEM_IS_LOCATED/spark.pem --region=us-east-1 login test19
```
clone this repo

https://github.com/jimcrozier/ibm_presentation.git
```
cd /ibm_presentation/boxsetup
sh setup.sh 
```
this will install all of the needed programs, and spaw mongo (leave this instance open).

After the programs are installed, ssh into the box with another terminal:
```
./spark-ec2 -k spark -i /WHERE_YOUR_PEM_IS_LOCATED/spark.pem --region=us-east-1 login test19
```
and run the following:
```
cd /ibm_presentation/ui/bin 
node www
```
You will have to log into your AWS account and open the ports for 3000 (for the app), 27017 (for mongo), and 8888 (for zeppelin). See http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/authorizing-access-to-an-instance.html for instructions on how to open new ports. 


Go to the IP address and port :3000 and login with admin/admin. 

Finally, log in the box 
```
./spark-ec2 -k spark -i /WHERE_YOUR_PEM_IS_LOCATED/spark.pem --region=us-east-1 login test19
```
and set a password for the user

```
passwd jim
```

(you can change the automatically generated name in the shell script, or just create a new user with add user).

Navigate to the the IP address port :8787 for RStudio server (log in with the username/pw that you created above), and open the R code make_data.R in the R folder. Run this code to generate the data in the anchor database (it will show up in the main dashboard graph). To generate HDFS make sure to change the IP to match your instance's IP (port :9000 for hdfs). 

Naviage to the IP address port :8888 for Zeppelin, and play with the code in the note.json notebook for interacting with the data that you created in the R make_data file. 

Notice that some of the bindings for the ec2 instances are absolute. Make sure that they are pointing at your instance IP address. 

See licenses for all of the open source tools and do not use outside of their instructions. 

