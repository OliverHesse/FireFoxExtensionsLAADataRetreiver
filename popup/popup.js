console.log("popup.js loaded");

document.getElementById('downloadBtn').addEventListener('click', function() {
    console.log("clicked");
    browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
        browser.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: extractData
      }).then(() => {
            console.log("Data extraction triggered.");
        }).catch((error) => {
            console.error("Error extracting data:", error);
        });
    });
  });
function extractData() {
    console.log("extracting data")
    const animalType = document.getElementById("animalType").value;
    const reportType = document.getElementById("reportType").value;
    const duration = document.getElementById("duration").value;
    const location = document.getElementById("location").value;
    const end_date = document.getElementById("date").value
    const locationLabel = document.querySelector('select[name="location"] option:checked').parentElement.label
    let filter_text = "[Filters]\n";
    let filter_titles = "animals,report type,duration,end date,location type,location\n"
    filter_text += filter_titles+animalType+","+reportType+","+duration+","+end_date+","+locationLabel+","+location+"\n"
    
    let date = document.getElementsByClassName("last-updated")[0].innerHTML.split(" ")[2]
    let table_columns = "SubTableName,Identifier,TotalNumber,TotalPrice,WeekChangeNumber,WeekChangePrice,AssuredNumber,AssuredPrice,NonAssuredNumber,NonAssuredPrice\n"
    
    const tables = document.getElementById('tables');  
   
    if (tables) {
        
        let table_as_string = "[Tables]\n"+table_columns
        for (const table of tables.children) {
            let children = table.children;
            
            
            let table_name = children[0].children[0].children[0].children[0];
            
            
      
            let tbody = children[1];
            
     
            for (const row of tbody.children) {
                let row_text = "";
              
              
                for (const cell of row.children) {
          
                    row_text += cell.innerHTML.replace(/<b>/g, "").replace(/<\/b>/g, "") + ","; 
                }
                
                row_text = row_text.slice(0, -1);
                
                table_as_string += table_name.innerHTML+","+row_text+"\n"
            }
        }
        
        let data = [filter_text+table_as_string,date] 
        browser.runtime.sendMessage({
            action: 'downloadData',
            data: data
        });
    }else{
        console.log("div not found")
     
    }
}


function saveDataToFile(data) {
    console.log("saving data to file");
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
  
    browser.downloads.download({
      url: url,
      filename: "downloaded_data.txt",
      saveAs: true
    });
}