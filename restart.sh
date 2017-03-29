kill -9 `ps -ef |grep -v grep |grep spring | grep -v V12Demo |awk '{print $2 }'`

>|nohup.out
#>|myapplication.log
nohup /opt/jboss/users/akhil/jdk1.8.0_65/bin/java -jar -DcProperties=/opt/jboss/users/Kuldeep/springAngular2/config.properties -Djava.util.logging.config.file=/opt/jboss/users/Kuldeep/springAngular2/ora.properties -Doracle.jdbc.Trace=true testingtool-0.0.1.jar  &
tail -f nohup.out
