/*
 * Decompiled with CFR 0_97.
 * 
 * Could not load the following classes:
 *  org.json.JSONArray
 *  org.json.JSONObject
 */
package com.tcs.testtool;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;

public class TestRepoService {
	private Connection connection = Utilities.getConnection();

	public JSONArray fetchJSONFromQuery(String query) throws Exception {
		String query1 = query.replaceFirst("fullStop", ".");
		System.out.println("Entering into fetchJSONFromQuery(" + query1 + ")");
		Utilities utils = new Utilities();
		JSONArray jArray = new JSONArray();
		ResultSet rs = utils.execQuery(query1);
		jArray = utils.convertToJSON(rs);
		return jArray;
	}
	
	public JSONArray fetchHeaderJSONFromQuery(String query) throws Exception {
		String query1 = query.replaceFirst("fullStop", ".");
		System.out.println("Entering into fetchJSONFromQuery(" + query1 + ")");
		Utilities utils = new Utilities();
		JSONArray jArray = new JSONArray();
		ResultSet rs = utils.execQuery(query1);
		jArray = utils.convertToJSON(rs);
		return jArray;
	}

	public JSONArray fetchBlobToString(String query) throws IOException, SQLException {
		System.out.println("Entering into fetchBlobToString = " + query);
		Utilities utils = new Utilities();
		ResultSet rs = utils.execQuery(query);
		StringBuffer strOut = new StringBuffer();
		while (rs.next()) {
			String aux;
			Blob b = rs.getBlob(1);
			BufferedReader br = new BufferedReader(new InputStreamReader(b.getBinaryStream()));
			while ((aux = br.readLine()) != null) {
				strOut.append(aux);
				strOut.append("\n");
			}
		}
		JSONArray jsonArray = new JSONArray();
		JSONObject obj = new JSONObject();
		String columnName = "XMLData";
		StringBuffer columnValue = strOut;
		obj.put(columnName, (Object)columnValue);
		jsonArray.put((Object)obj);
		return jsonArray;
	}

	public JSONArray fetchJSONFromTable(String table, int from, int to, int rownum) throws Exception {
		System.out.println("Entering into fetchJSONFromTable(" + table + "," + from + "," + to + " )");
		Utilities utils = new Utilities();
		JSONArray jArray = new JSONArray();
		StringBuffer sqlStmnt = null;
		sqlStmnt = new StringBuffer("  ");
		String str = new String();
		str = "select * from Table_Reporting_Details where table_name ='" + table + "' and show_column = 'Y' order by column_seq";
		sqlStmnt.append(str);
		ResultSet rsTableDetail = utils.execQuery(sqlStmnt.toString());
		if (rsTableDetail.next()) {
			StringBuffer mainQuery = new StringBuffer();
			StringBuffer execQuery = new StringBuffer();
			execQuery.append(" ");
			mainQuery.append("select ");
			String paginationKey = new String();
			int loopcount = 0;
			do {
				if (loopcount != 0) {
					mainQuery.append(",");
				}
				paginationKey = rsTableDetail.getString("unique_key");
				mainQuery.append(String.valueOf(rsTableDetail.getString("column_name")) + " " + rsTableDetail.getString("column_alias") + " ");
				++loopcount;
			} while (rsTableDetail.next());
			try {
				if (rsTableDetail != null) {
					rsTableDetail.close();
				}
			}
			catch (Exception var14_16) {
				// empty catch block
			}
			mainQuery.append("from " + table);
			if (from != 0 || to != 0) {
				mainQuery.append(" where " + paginationKey + " >= " + from + " and " + paginationKey + " <= " + to + " order by " + paginationKey + " desc");
			} else {
				mainQuery.append(" order by " + paginationKey + " desc");
			}
			execQuery.append("select * from ( ");
			execQuery.append(mainQuery.toString());
			execQuery.append(")");
			if (rownum > 0) {
				execQuery.append(" where rownum <= " + rownum);
			}
			System.out.println("exec query = " + execQuery);
			ResultSet rsMain = utils.execQuery(execQuery.toString());
			return utils.convertToJSON(rsMain);
		}
		System.out.println("SetUp for table " + table + "  is not done !!");
		String strQ = new String();
		strQ = "select * from " + table + " where rownum < 1000";
		ResultSet rs2 = utils.execQuery(strQ);
		return utils.convertToJSON(rs2);
	}

	public void updateTableData(String updateTable, String primaryKey, JSONObject jsonString) {
		System.out.println("Entering into updateTableData(" + updateTable + "," + primaryKey + "," + jsonString + " )");
		//JSONObject jsonObject = jsonString;
		Utilities utils = new Utilities();

		StringBuffer sqlStmntnew = null;
		sqlStmntnew = new StringBuffer("  ");
		String str = new String();
		str = "select column_name,column_datatype from TABLE_REPORTING_DETAILS where table_name ='" + updateTable+"'" ;
		sqlStmntnew.append(str);
		ResultSet rsTableDetail = utils.execQuery(sqlStmntnew.toString());
		Map<String, String> tableInfo = new HashMap<String, String>();

		try {
			while (rsTableDetail.next())
			{
				tableInfo.put(rsTableDetail.getString(1).toUpperCase(), rsTableDetail.getString(2));
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			if (rsTableDetail != null) {
				rsTableDetail.close();
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}

		StringBuffer sqlStmnt = new StringBuffer();
		sqlStmnt.append("update ");
		sqlStmnt.append(updateTable);
		sqlStmnt.append(" set  ");
		String primaryKeyValue = null;
		jsonString.remove("$$hashKey");
		primaryKeyValue = jsonString.get(primaryKey).toString();
		jsonString.remove(primaryKey);
		int length = jsonString.length();
		System.out.println("Length Of JSON String --> "+length);
		System.out.println("Table Details --> " + tableInfo.toString());
		int count = 0;
		for (Object key : jsonString.keySet())
		{
			String keyStr = (String)key;
			Object keyvalue = jsonString.get(keyStr);
			count++;
			System.out.println("Values of JSON -->");
			String str1 = keyvalue.toString().replace("FULLSTOP", ".");
			String str2 = str1.replace("BACKSLASH", "/");
			System.out.println(keyStr + " = " +"'"+ str2 +"'");
			//			if(keyStr.compareTo("$$hashKey") != 0)
			//			{
			String chkDataType = keyStr.toUpperCase();
			String dataType = tableInfo.get(chkDataType);
			System.out.println("Datatype --> "+dataType);
			if(dataType.equalsIgnoreCase("date"))
			{
				StringBuffer datestr = new StringBuffer("to_date('");
				datestr.append(str2.replace(" 00:00:00.0", ""));
				datestr.append("','yyyy-mm-dd')");
				System.out.println("datestr --> "+datestr);
				sqlStmnt.append(keyStr + " = " + datestr );
				if(count < (length))
				{
					sqlStmnt.append(" ,");
				}
				continue;
			}
			//			}
			//if ((!(keyStr.equals(primaryKey)))  && keyStr.compareTo("$$hashKey") != 0 )
			//			if ((!(keyStr.equals(primaryKey))))
			//			{
			sqlStmnt.append(keyStr + " = " +"'"+ str2 +"'");
			if(count < (length))
			{
				sqlStmnt.append(" ,");
			}
			//			}
			//			if (keyStr.equals(primaryKey) )
			//			{
			//				primaryKeyValue = str2;
			//			}
		} 
		sqlStmnt.append(" where ");
		sqlStmnt.append(primaryKey);
		sqlStmnt.append(" = ");
		sqlStmnt.append("'" + primaryKeyValue + "'");
		System.out.println(sqlStmnt);
		ResultSet rs = utils.execQuery(sqlStmnt.toString());
	}
}
