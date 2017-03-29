kill -9 `ps -ef |grep -v grep |grep spring |awk '{print $2 }'`
