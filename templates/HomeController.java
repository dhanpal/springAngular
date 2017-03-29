package com.programmingfree.springservice;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod; 
@Controller
public class HomeController {
        @RequestMapping("/charts3") 
      public String charts3(){
            return "charts3"; 
     }
 
        @RequestMapping("/charts") 
      public String charts(){
            return "charts"; 
     }
 
        @RequestMapping("/dashboard") 
      public String dashboard(){
            return "dashboard"; 
     }
 
        @RequestMapping("/flotchart") 
      public String flotchart(){
            return "flotchart"; 
     }
 
        @RequestMapping("/index") 
      public String index(){
            return "index"; 
     }
 
        @RequestMapping("/suiteHome") 
      public String suiteHome(){
            return "suiteHome"; 
     }
 
        @RequestMapping("/todolist") 
      public String todolist(){
            return "todolist"; 
     }
 
        @RequestMapping("/trades") 
      public String trades(){
            return "trades"; 
     }
 
        @RequestMapping("/viewDetailExpand") 
      public String viewDetailExpand(){
            return "viewDetailExpand"; 
     }
 
        @RequestMapping("/viewDetail") 
      public String viewDetail(){
            return "viewDetail"; 
     }
 
        @RequestMapping("/viewDetailPanels") 
      public String viewDetailPanels(){
            return "viewDetailPanels"; 
     }
 
        @RequestMapping("/wildCardSearch") 
      public String wildCardSearch(){
            return "wildCardSearch"; 
     }
 
        @RequestMapping("/work") 
      public String work(){
            return "work"; 
     }
 
}
