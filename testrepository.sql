drop table TestRepo ;
create table TestRepo
(
    ModuleName varchar2(100),
    SubModule varchar2(100),
    Funtionality varchar2(100),
    TestCaseFlow varchar2(100),
    TestCaseType varchar2(100),
    LastExecutedDateTime date,
    LastExecutedStatus varchar2(10)
);
