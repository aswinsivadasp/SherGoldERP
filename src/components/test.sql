if @statementType='agentReport'
begin
    -- Create temporary tables for storing intermediate and final results
    Create table #AgentReportTotal
    (
        accno nvarchar (max),
        ledname nvarchar (max),
        atdate nvarchar (max),
        atEntryno nvarchar (max),
        atType nvarchar (max),
        rate nvarchar (max),
        redeemrate nvarchar (max),
        atDebitAmount numeric(18,4),
        atDebitWeight numeric(18,4),
        atCreditAmount nvarchar (max),
        atCreditWeight numeric(18,4),
        atNarration nvarchar (max),
        dayss nvarchar (max),
        IntrestAmount nvarchar (max),
        intrPerc nvarchar(max),
        Agent nvarchar(max)
    )

    Create table #AgentReportSummary
    (
        accno nvarchar (max),
        ledname nvarchar (max),
        atdate nvarchar (max),
        atEntryno nvarchar (max),
        atType nvarchar (max),
        rate nvarchar (max),
        redeemrate nvarchar (max),
        atDebitAmount nvarchar (max),
        atDebitWeight numeric(18,4),
        atCreditAmount nvarchar (max),
        atCreditWeight numeric(18,4),
        atNarration nvarchar (max),
        dayss nvarchar (max),
        IntrestAmount nvarchar (max),
        intrPerc nvarchar(max),
        Agent nvarchar(max),
        schemeBalance nvarchar(max),
        BalanceWeight nvarchar(max)
    )

    declare @DAmount1 numeric(18,4)=0, @DWeight1 numeric(18,4)=0, @CAmount1 numeric(18,4)=0, @CWeight1 numeric(18,4)=0, @IAmount1 numeric(18,4)=0

    -- Build dynamic SQL query
    set @cmd = 'insert into #AgentReportTotal
    select accno , ledname , Convert(varchar(12),atdate,105) as date ,atEntryno , atType , 
    case when atType  in (select fmrAbbreviation from FormRegistration where fmrTypeOfVoucher = ''RECEIPT'')
    then (select srInfo_rate from schemeReceiptInformation where SrInfo_entryno=atEntryno and SrInfo_frmID in
    (select fmrEntryNo from FormRegistration where fmrAbbreviation=c.atType ) )
    else '''' end as Rate,
    case when atType  in (select fmrAbbreviation from FormRegistration where fmrTypeOfVoucher = ''REDEEM'') 
    then (select rate from Scheme_Redeem where entryno=atEntryno and FrmID in
    (select fmrEntryNo from FormRegistration where fmrAbbreviation=c.atType ) )
    else '''' end as redeemRate,
    
    atDebitAmount, atDebitWeight, atCreditAmount, atCreditWeight, atNarration,
    DATEDIFF(DAY, c.atDate, GETDATE()) AS dayss,
    CASE 
        WHEN atType IN (SELECT fmrAbbreviation FROM FormRegistration WHERE fmrTypeOfVoucher = ''RECEIPT'')
        THEN ( ((c.atCreditAmount * (select intperc from Scheme_Registration s where s.accname = c.atLedCode)
         / 100) / 365) * DATEDIFF(DAY, c.atDate, GETDATE()))
        WHEN atType IN (SELECT fmrAbbreviation FROM FormRegistration WHERE fmrTypeOfVoucher = ''REDEEM'')
        THEN (((c.atDebitAmount * (select intperc from Scheme_Registration s where s.accname = c.atLedCode)
         / 100) / 365) * DATEDIFF(DAY, c.atDate, GETDATE()) * -1)
        ELSE NULL
    END as IntrestAmount,
    
    a.intperc,
    
    CASE 
        WHEN atType IN (SELECT fmrAbbreviation FROM FormRegistration WHERE fmrTypeOfVoucher = ''RECEIPT'')
        THEN (
            SELECT (select Name from SalesMan where Auto=(select fmrAgentId from FormRegistration where fmrEntryNo=SrInfo_frmID)) 
            FROM schemeReceiptInformation 
            WHERE SrInfo_entryno = atEntryno 
            AND SrInfo_frmID IN (
                SELECT fmrEntryNo 
                FROM FormRegistration 
                WHERE fmrAbbreviation = c.atType
            )
        )
        WHEN atType IN (SELECT fmrAbbreviation FROM FormRegistration WHERE fmrTypeOfVoucher = ''REDEEM'')
        THEN (
            SELECT (select Name from SalesMan where Auto=(select fmrAgentId from FormRegistration where fmrEntryNo=FrmID)) 
            FROM Scheme_Redeem 
            WHERE entryno = atEntryno 
            AND FrmID IN (
                SELECT fmrEntryNo 
                FROM FormRegistration 
                WHERE fmrAbbreviation = c.atType
            )
        )
        ELSE NULL
    END as agent
    from Scheme_Registration a, LedgerNames b, Account_Transactions c 
    where a.accname = Ledcode and c.atLedCode = a.accname and atDate between ''' + @sdate + ''' and ''' + @edate + ''''

    -- Apply filters
    if (@customer != 0)
    begin
        set @wheresql = ' and Ledcode= ' + @customer + ' '
    end

    if (@mobile != '')
    begin
        set @wheresql = ' and a.mobileNo= ''' + @mobile + ''' '
    end

    if (@Ano != '')
    begin
        set @wheresql = ' and a.accno= ''' + @Ano + ''' '
    end

    if (@agent != 0)
    begin
        set @wheresql = ' and c.atType in (select fmrAbbreviation from FormRegistration where fmrAgentId= ''' + @agent + ''')'
    end

    set @cmd = @cmd + @wheresql
    set @cmd = @cmd + ' order by agent, accno, atType'
    exec (@cmd)

    -- Insert aggregated data into temporary table
    insert into #AgentReportSummary
    select  
        ISNULL(accno, '') accno,
        ISNULL(ledname, '') ledname,
        ISNULL(atdate, '') Date,
        ISNULL(atEntryno, '') atEntryno,
        ISNULL(atType, 'Sub Total') atType,
        ISNULL(rate, '') rate,
        ISNULL(redeemrate, '') redeemrate,
        sum(CAST(atDebitAmount as numeric(18,4))) atDebitAmount,
        sum(CAST(atDebitWeight as numeric(18,4))) atDebitWeight,
        sum(CAST(atCreditAmount as numeric(18,4))) atCreditAmount,
        sum(CAST(atCreditWeight as numeric(18,4))) atCreditWeight,
        ISNULL(atNarration, '') atNarration,
        ISNULL(dayss, '') dayss,
        sum(CAST(IntrestAmount as numeric(18,4))) IntrestAmount,
        ISNULL(intrPerc, '') intperc,
        ISNULL(Agent, '') Agent,
        (sum(CAST(atCreditAmount as numeric(18,4))) - sum(CAST(atDebitAmount as numeric(18,4)))) schemeBalance,
        (sum(CAST(atCreditWeight as numeric(18,4))) - sum(CAST(atDebitWeight as numeric(18,4)))) BalanceWeight
    from #AgentReportTotal 
    group by grouping sets ((Agent, accno, ledname, atEntryno, atdate, atType, dayss, atNarration, rate, redeemrate, intrPerc), (Agent))

    -- Calculate commission for each agent and add it to the report
    insert into #AgentReportSummary
    select 
        '',
        '',
        '',
        '',
        'Commission',
        '',
        '',
        '',
        '',
        CAST(sum(atCreditAmount) * 0.06 as numeric(18,4)) as CommissionAmount,  -- 6% commission on receipt (credit) amount
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    from #AgentReportSummary
    where atType = 'Sub Total'
    group by Agent

    -- Return final report
    select * from #AgentReportSummary
    order by CASE WHEN atType = 'Total' THEN 1 ELSE 0 END ASC
end
