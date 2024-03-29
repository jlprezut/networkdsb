/**
 * vanillajs-table v0.1.0
 *
 * Library to create HTML-tables by vanilla JavaScript.
 *
 * @author Sergey Zezyulin
 */

class Table {
    constructor(options) {
        options = (typeof(options) === "object") ? options : {};

        this.element = options.element;
        this.data = options.data;
        this.headers = options.headers;
        this.noHeaders = options.noHeaders ;
        this.height = options.height;
        this.undefined_headers = Boolean(options.undefined_headers);
        this.empty = options.empty || "----";
    }

    view() {
        /**
         * The next method visualizes the table.
         *
         * This method remove all child nodes in the table
         * container (this.element), and create two
         * tables: the header table and the data table.
         */
        const element = this.element;

        // Checking the table container.
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            console.error("Table container is not a HTMLElement.");
            return false;
        }

        // Removing all child nodes.
  //      while (element.firstChild) {
  //          element.removeChild(element.firstChild);
  //      }

        // Formating the data table.
        if (!Array.isArray(this.data)) {
            this.data = [this.data];
        };

        // Formating the header table.
        let headers = new Object();

        this.data.forEach(function(column) {
            if (typeof(column) === "object") {
                for (let key in column) {
                    if (!(key in headers)) {
                        headers[key] = new Object();
                    }
                }
            } else {
                headers["(values)"] = new Object();
            }
        });

        // Merging with pre-installed headers.
        if (this.headers) {
            if (Boolean(this.undefined_headers)) {
                Object.assign(headers, this.headers);
            } else {
                headers = this.headers;
            }
        }

        // We have to set the table container CSS-class
        // before visualize inner elements.
        //element.classList.add("vanillajs-table");

        // Visualizing the header table.
        var table = document.createElement("table");
        if (this.noHeaders === false) {
          let tr = table.appendChild(document.createElement("tr"));
          for (let key in headers) {
              let td = tr.appendChild(document.createElement("td"));
              let name = "name" in headers[key] ? headers[key].name : key;
              td.appendChild(document.createTextNode(name));
              // Setting a TD-elements width.
          /*
              if ("width" in headers[key]) {
                  td.width = headers[key].width;
              }
          */
          };
        //table.className = "vanillajs-table-header";
//        element.appendChild(table);

        // Getting headers width to applying to data table.
          let headers_names = Object.keys(headers);
          tr.childNodes.forEach(function(td, index) {
              let header = headers_names[index];
              let property = headers[header];
            //  property.width = property.width || td.offsetWidth;
          });
        }
        // Creating the data table style.
        // We have to add "box-sizing" attribute to correct width setting.
  /*      let style = document.createElement("style");
        let style_property = document.createTextNode(".vanillajs-table td { box-sizing: border-box; }");
        style.appendChild(style_property);
        document.head.appendChild(style);
*/
        // Visualizing the data table.
  //      var table = document.createElement("table");
        this.data.forEach(function(row, index) {
            let tr = table.appendChild(document.createElement("tr"));
            let td = undefined;
            for (let header in headers) {
                let value = this.empty;
                let tips = '' ;
                let property = headers[header];
                if (typeof(row) === "object") {
                    if (header in row) {
                        // Appling data format option.
                        if ("format" in property && typeof(property.format) === "function") {
                            value = property.format(row[header]);
                        } else {
                            value = row[header].value;
                        }
                        if (row[header].type) {
                          var compImg = 'Up' ;
                          if (row[header].link === null) {
                            compImg = 'Empty'
                          }
                          if (value === 'e') {
                            compImg = 'Error' ;
                          }
                          if (value === 'd') {
                            compImg = 'Down' ;
                          }
                          value = `<span class='A_tooltip'><img class='${row[header].type}${compImg}Img' onclick="mobile.eventUserAction({ 'typeObj': 'Port', 'idObj': ${row[header].id_obj} },'parcours','affichageOne')"><span>${row[header].link}</span></span>`
                        } else {
                          if (row[header].informations) {
                            value = `<span class='A_tooltip'>${value}<span>${row[header].informations}</span></span>` ;
                          }
                        }
                    }
                } else if (header === "(values)") {
                    value = row;
                }
                td = tr.appendChild(document.createElement("td"));
                //td.appendChild(document.createTextNode(value));
                td.innerHTML = value ;
                // Setting a TD-elements width for first TR-element only.
                // Setting width - is a slowly action.
              /*
                if (index === 0) {
                    td.width = property.width;
                }
              */
            };
            // Last element should not have width attribute.
            /*
            if (index === 0) {
                td.width = "auto";
            }
            */
        }, this);

        // Inserting the data table into div.
        let div = document.createElement("div");
        //div.className = "vanillajs-table-data";
        //div.style.overflow = "auto";

        // Setting a table height.
        if (this.height) {
            // User can set height as number or string.
            let height = parseFloat(this.height);
            div.style.maxHeight = height + "px";
        }
        div.appendChild(table);
        element.appendChild(div);

        // Adding a resize method to the table container.
        // We have to calling this method each time when the window
        // resize event is triggered.
        element.resize = this.resize;

        // Resizing table after content is loading.
        //element.resize();
    }

    resize() {
        /**
         * The next method resizes the table.
         *
         * The header table must be placed before the data table,
         * otherwise it will not work.
         */
        let headers_width = [];
        this.childNodes.forEach(function(table) {
            if (table.classList.contains("vanillajs-table-header")) {
                // It's the header table.
                table.firstChild.childNodes.forEach(function(td) {
                    headers_width.push(td.offsetWidth);
                });
            } else {
                // It's the data table.
          /*      table.firstChild.firstChild.childNodes.forEach(function(td, index) {
                    td.width = headers_width[index];
                });

          */
            }
        });
    }
}

/**
 * The next code resizes all tables when window resize.
 *
 * The function to execute each time the window resize event is triggered.
 * Delay 100ms.
 */
(function() {
    let timeisout = 0;

    window.onresize = function() {
        clearTimeout(timeisout);
        timeisout = setTimeout(function() {
            let tables = document.getElementsByClassName("vanillajs-table");
            for (let i = 0; i < tables.length; i++) {
                tables[i].resize();
            }
        }, 100);
    }
})();

export default Table ;
