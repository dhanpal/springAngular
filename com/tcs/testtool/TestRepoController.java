/*
 * Decompiled with CFR 0_97.
 * 
 * Could not load the following classes:
 *  org.json.JSONArray
 *  org.json.JSONObject
 *  org.springframework.web.bind.annotation.PathVariable
 *  org.springframework.web.bind.annotation.RequestMapping
 *  org.springframework.web.bind.annotation.RequestMethod
 *  org.springframework.web.bind.annotation.RestController
 */
package com.tcs.testtool;

import com.tcs.testtool.TestRepoService;
import java.io.PrintStream;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestRepoController {
    TestRepoService testreposervice = new TestRepoService();

    @RequestMapping(value={"/fetchjsonfromtable/{table}/{from}/{to}/{rownum}"}, method={RequestMethod.GET}, headers={"Accept=application/json"})
    public String getTableData(@PathVariable String table, @PathVariable int from, @PathVariable int to, @PathVariable int rownum) {
        System.out.println("Entering into function getTableData(" + table + "," + from + " , " + to + " , " + rownum + ")");
        JSONArray retJSON = new JSONArray();
        try {
            retJSON = this.testreposervice.fetchJSONFromTable(table, from, to, rownum);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return retJSON.toString();
    }

    @RequestMapping(value={"/fetchHeaderJson/{query}"}, method={RequestMethod.GET}, headers={"Accept=application/json"})
    public String getHeaderData(@PathVariable String query) {
        JSONArray retJSON = new JSONArray();
        try {
            retJSON = this.testreposervice.fetchHeaderJSONFromQuery(query);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return retJSON.toString();
    }
    
    @RequestMapping(value={"/fetchjsonfromquery/{query}"}, method={RequestMethod.GET}, headers={"Accept=application/json"})
    public String getQueryData(@PathVariable String query) {
        JSONArray retJSON = new JSONArray();
        try {
            retJSON = this.testreposervice.fetchJSONFromQuery(query);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return retJSON.toString();
    }

    @RequestMapping(value={"/fetchblob/{query}"}, method={RequestMethod.GET}, headers={"Accept=application/json"})
    public String getBlobToString(@PathVariable String query) {
        JSONArray retJSON = new JSONArray();
        try {
            retJSON = this.testreposervice.fetchBlobToString(query);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return retJSON.toString();
    }

    @RequestMapping(value={"/updateTable/{tableName}/{primaryKey}/{jsonObject}"}, method={RequestMethod.GET}, headers={"Accept=application/json"})
    public String postTableData(@PathVariable String tableName, @PathVariable String primaryKey, @PathVariable JSONObject jsonObject) {
        System.out.println("Entering into function postTableData(" + tableName + "," + primaryKey + " , " + (Object)jsonObject + ")");
        JSONObject retJSON = new JSONObject();
        try {
            this.testreposervice.updateTableData(tableName, primaryKey, jsonObject);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        return retJSON.toString();
    }
}
