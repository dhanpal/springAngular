/*
 * Decompiled with CFR 0_97.
 * 
 * Could not load the following classes:
 *  org.json.JSONArray
 *  org.json.JSONObject
 */
package com.tcs.testtool;

import java.io.FileInputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.json.JSONArray;
import org.json.JSONObject;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;

public class Utilities {
	private static Connection connection = null;

	public static Connection getConnection() {
		if (connection != null) {
			return connection;
		}
		try {
			String propFile = System.getProperty("cProperties");
			Properties prop = new Properties();
			try {
				FileInputStream fis = new FileInputStream(propFile);
				if (fis != null) {
					prop.load(fis);
				}
			}
			catch (Exception e) {
				e.printStackTrace();
			}
			String driver = prop.getProperty("driver");
			String url = prop.getProperty("url");
			String user = prop.getProperty("user");
			String password = prop.getProperty("password");
			connection = DriverManager.getConnection(url, user, password);
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		return connection;
	}

	public JSONArray convertToJSON(ResultSet resultSet) throws Exception {
		JSONArray jsonArray = new JSONArray();
		while (resultSet.next()) {
			int total_columns = resultSet.getMetaData().getColumnCount();
			JSONObject obj = new JSONObject();
			for (int i = 0; i < total_columns; ++i) {
				String columnName = resultSet.getMetaData().getColumnLabel(i + 1).toLowerCase();
				Object columnValue = resultSet.getObject(i + 1);
				if (columnValue == null) {
					columnValue = "";
				}
				obj.put(columnName, columnValue);
			}
			jsonArray.put((Object)obj);
		}
		return jsonArray;
	}

	public JSONArray convertToJSONArray(ResultSet resultSet) throws Exception {
		JSONArray jsonArray = new JSONArray();
		JSONObject obj = new JSONObject();
		Map<String, Set<String>> headerGroup = new HashMap<String, Set<String>>();
		while(resultSet.next()) {
			String groupId = resultSet.getString(1);
			Set<String> header = headerGroup.containsKey(groupId) ? 
					headerGroup.get(groupId) : new HashSet<String>();
					header.add(resultSet.getString(2));
					headerGroup.put(groupId, header);
			System.out.println(headerGroup.toString());
		}
		System.out.println("Header JSON --> "+jsonArray);
		return jsonArray;
	}

	public ResultSet execQuery(String query) {
		System.out.println("Entering  into function execQuery(" + query + ")");
		PreparedStatement preparedStatement = null;
		ResultSet rs = null;
		StringBuffer sqlStmt = null;
		sqlStmt = new StringBuffer("  ");
		sqlStmt.append(query);
		try {
			preparedStatement = connection.prepareStatement(sqlStmt.toString());
			rs = preparedStatement.executeQuery();
		}
		catch (SQLException e) {
			e.printStackTrace();
		}
		return rs;
	}

	public String formatXML(String input) {
		try {
			Transformer transformer = TransformerFactory.newInstance().newTransformer();
			transformer.setOutputProperty("indent", "yes");
			transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "3");
			StreamResult result = new StreamResult(new StringWriter());
			DOMSource source = new DOMSource(this.parseXml(input));
			transformer.transform(source, result);
			return result.getWriter().toString();
		}
		catch (Exception e) {
			e.printStackTrace();
			return input;
		}
	}

	private Document parseXml(String in) {
		try {
			DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
			DocumentBuilder db = dbf.newDocumentBuilder();
			InputSource is = new InputSource(new StringReader(in));
			return db.parse(is);
		}
		catch (Exception e) {
			throw new RuntimeException(e);
		}
	}
}
