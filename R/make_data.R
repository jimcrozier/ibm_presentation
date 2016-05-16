library(RMySQL)
library(randomNames)
library(chron)

#create some sample users using the randomNames package:
user_data = data.frame(
  customer_id = base::sample(1:1e5,100), 
  first_name = randomNames(100, which.names="first"),
  last_name = randomNames(100, which.names="last")
)

#read in the products: 
products = read.csv("~/cust_db/price_list.csv")

#weight smaller items higher:
#this could be better:
w_n <- data.frame(n = 1:NROW(products), ww = .4*(1/(1:NROW(products))))


#weighted dates:
dts = data.frame(dt = Sys.Date() - 1:1095)
dts$day <- weekdays(as.Date(dts$dt))
dts$months <- months(as.Date(dts$dt))
dts$wght_day <- sapply(dts$day, switch, 
                  Sunday = 0, 
                  Monday = 0.6, 
                  Tuesday = 0.7, 
                  Wednesday = 0.8,                  
                  Thursday = 0.9, 
                  Friday = 1, 
                  Saturday = 1.2)
dts$wght_month <- sapply(dts$month, switch, 
                       January = 0.5, 
                       February = 0.4, 
                       March = 0.6, 
                       April = 0.7,                  
                       May = 0.8, 
                       June = 1.1, 
                       July = 1.2,
                       August = 1.3,
                       September = 1,
                       October = 0.7,
                       November =0.6,
                       December = 0.5)
dts$wght = dts$wght_day*dts$wght_month

#create an order with random sampling and order weights:
order_fn = function(){
  #create container:
  order = list()
  #choose a basket mix not larger than the products list, with lower basket 
  #quanities more likely:
  for (i in 1:base::sample(seq_len(nrow(products)),1,prob=w_n$ww)){
    #grab a product
    prod_n = base::sample(1:NROW(products),1)
    #make sure that a product only shows up once:
    if(i>1){
      while (prod_n %in% prod_ns) {
        prod_n = base::sample(1:NROW(products),1)
      }
    }
    if (i==1) prod_ns = prod_n else prod_ns = c(prod_ns, prod_n)
    
    #fill in the order 
    order[[i]] = data.frame(
      prod_n = prod_n,
      nbr_items = base::sample(seq_len(nrow(products)),1,prob=w_n$ww)
    )
    
  }
  
  order = do.call("rbind", order)
  #output the order:
  order = data.frame(products[order$prod_n,],qnty= order$nbr_items)
  order$rev = order$price*order$qnty
  
  return(order)
}

#create database 
for (purc_i in 1:1000){
  print(purc_i)
  #grab a customer 
  cust = user_data[base::sample(1:NROW(user_data),1),]
  #make a fake order 
  o = order_fn()   
  # choose a date from the past year
  dt = data.frame(dt =chron(dates=paste(base::sample(dts$dt,1,prob=dts$wght)),
                  times=paste0(base::sample(6:21,1),":", base::sample(1:59,1),":", base::sample(1:59,1)),
             format=c('y-m-d','h:m:s')))
  #output the purchase 
  out = cbind(dt = matrix(gsub("\\(","",gsub("\\)","",paste(dt[[1]]))),NROW(o)), cust, o,row.names = NULL)
  if (purc_i == 1) {
    #write the order to a simple database:
    dbWriteTable(mydb, "cust_purchases",out, overwrite=T,row.names=F)
  } else {dbWriteTable(mydb, "cust_purchases",out, append=T,row.names=F)
  }
}
#check the data: 
testthis = sqlQuery(conn, "select * from anchor.cust_purchases limit 1000")
