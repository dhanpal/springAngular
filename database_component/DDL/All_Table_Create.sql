create table table_reporting_details(
TEMPLATE_ID          NUMBER(9),    
TABLE_NAME           VARCHAR2(35), 
COLUMN_NAME          VARCHAR2(35) ,
COLUMN_ALIAS         VARCHAR2(35) ,
COLUMN_SEQ           NUMBER(3)    ,
COLUMN_DATATYPE      VARCHAR2(35) ,
DEFALUT_ORDERBY      VARCHAR2(35) ,
UNIQUE_KEY           VARCHAR2(35) ,
SHOW_COLUMN          VARCHAR2(2)
);

create table testdashboard_al(
SEQNO            NUMBER(9)    , 
PROGRAMNAME      VARCHAR2(100) ,
PATH             VARCHAR2(100) ,
HOSTNAME         VARCHAR2(30) 
);
create sequence seq_testdashboard_al start  with 1;

create table testdashboard_em(
SEQNO              NUMBER(9)  ,   
PARAMETERNAME      VARCHAR2(100), 
PARAMETERTYPE      VARCHAR2(30)  ,
SETVALUE           VARCHAR2(30)  
);
create sequence seq_testdashboard_em start  with 1;

create table testdashboard_tcr(
FUNCTIONAREA      VARCHAR2(200), 
SCENARIOS         VARCHAR2(200) ,
STP               VARCHAR2(2)   ,
SCRIPTSCOPE       VARCHAR2(200) ,
SCRIPTNAME        VARCHAR2(200) ,
SEQNO             NUMBER(9) 
);
create sequence seq_testdashboard_tcr start  with 1;

create table testdashboard_tcrm(
FUNCTIONAREA      VARCHAR2(200) ,
SCENARIOS         VARCHAR2(200) ,
STP               VARCHAR2(2)   ,
SCRIPTSCOPE       VARCHAR2(200) ,
SCRIPTNAME        VARCHAR2(200) ,
SEQNO             NUMBER(9) 
);
create sequence seq_testdashboard_tcrm start  with 1;

create table testdashboard_reports(
REPORTNAME         VARCHAR2(200), 
REPORTPATH         VARCHAR2(200) ,
REPORTGENTIME      DATE          ,
SEQNO              NUMBER(9)     ,
REPORTID           VARCHAR2(100) ,
REPORTFILE         BLOB  
);
create sequence seq_testdashboard_reports start  with 1;

create table testdashboard_mws(
CNTOK                NUMBER(09),       
STATUS               CHAR(2)    ,  
PROCESSINGTIME       CHAR(10)    , 
SEQNO                NUMBER(9)    ,
MARKETSCENARIOS      VARCHAR2(40) ,
CNTNOK               NUMBER(9)    
);
create sequence seq_testdashboard_mws start  with 1;

create table testdashboard_pp(
EVENT           VARCHAR2(200) ,
EVENTSTATE      VARCHAR2(100), 
SEQNO           NUMBER(9)    
);
create sequence seq_testdashboard_pp start  with 1;

create table testdashboard_cte(
ORDER#               NUMBER(9)   , 
ORDERDATE            VARCHAR2(15) ,
ORDERTIME            VARCHAR2(10) ,
CLIENTREFERENCE      VARCHAR2(20) ,
SEQNO                NUMBER(9)    ,
TXNTYPE              VARCHAR2(20) 
);
create sequence seq_testdashboard_cte start  with 1;

create table testdashboard_cards(
CARDNAME         VARCHAR2(15)  ,
COUNT            NUMBER(6)     ,
DESCRIPTION      VARCHAR2(100),
seqno number(09)
);
create sequence seq_testdashboard_cards start  with 1;

create table testdashboard_bluecard(
FUNCTIONAREAS         VARCHAR2(200) ,
COVEREDSCENARIOS      VARCHAR2(200) ,
SEQNO                 NUMBER(9) 
);
create sequence seq_testdashboard_bluecard start  with 1;

create table testdashboard_tcrs(
FUNCTIONAREA      VARCHAR2(200) ,
SCENARIOS         VARCHAR2(200) ,
STP               VARCHAR2(2)   ,
SCRIPTSCOPE       VARCHAR2(200) ,
SCRIPTNAME        VARCHAR2(200) ,
SEQNO             NUMBER(9)     ,
STATUS            VARCHAR2(100) 
);
create sequence seq_testdashboard_tcrs start  with 1;

--update testdashboard_al			set seqno = seq_testdashboard_al.nextval;
--update testdashboard_em         set seqno = seq_testdashboard_em.nextval;
--update testdashboard_tcr        set seqno = seq_testdashboard_tcr.nextval;
--update testdashboard_tcrm       set seqno = seq_testdashboard_tcrm.nextval;
--update testdashboard_reports    set seqno = seq_testdashboard_reports.nextval;
--update testdashboard_mws        set seqno = seq_testdashboard_mws.nextval;
--update testdashboard_pp         set seqno = seq_testdashboard_pp.nextval;
--update testdashboard_cte        set seqno = seq_testdashboard_cte.nextval;
--update testdashboard_cards      set seqno = seq_testdashboard_cards.nextval;
--update testdashboard_bluecard   set seqno = seq_testdashboard_bluecard.nextval;
--update testdashboard_tcrs   set seqno = seq_testdashboard_tcrs.nextval;
