import {generateToken} from "./TokenGen.js"

class GetChildren {
    response_parser(response){
        let r = /({.*?\[0\]\[0\])/gi
    
        // [...response.matchAll(r)].map(x => x[0])
        return Array.from(response.matchAll(r), x => x[0]);
    }

    async fetch(ressource,projet,cookies,token) {

        const url = "https://planning.univ-rennes1.fr/direct/gwtdirectplanning/"

        const raw = `7|0|20|${url}|ED09B1B4CB67D19361C6552338791595|com.adesoft.gwt.directplan.client.rpc.DirectPlanningServiceProxy|method4getChildren|J|java.lang.String/2004016611|com.adesoft.gwt.directplan.client.ui.tree.TreeResourceConfig/2234901663|${ressource}|[I/2970817851|java.util.LinkedHashMap/3008245022|COLOR|com.adesoft.gwt.core.client.rpc.config.OutputField/870745015|LabelColor||com.adesoft.gwt.core.client.rpc.config.FieldType/1797283245|NAME|LabelName|java.util.ArrayList/4159755760|com.extjs.gxt.ui.client.data.SortInfo/1143517771|com.extjs.gxt.ui.client.Style$SortDir/3873584144|1|2|3|4|3|5|6|7|${token}|8|7|0|9|2|-1|-1|10|0|2|6|11|12|0|13|11|14|15|11|0|0|6|16|12|0|17|16|14|15|4|0|0|18|0|18|0|19|20|1|16|18|0|`;
        
        const requestOptions = {
            method: "POST",
            "headers": {
                    "content-type": "text/x-gwt-rpc; charset=UTF-8",
                    "x-gwt-permutation": "",
                    "Cookie":cookies
                },
            body: raw,
        };
        return new Promise((resolve, reject) => {
            fetch("https://planning.univ-rennes1.fr/direct/gwtdirectplanning/DirectPlanningServiceProxy", requestOptions)
            .then((response) => resolve(response.text()))
            .catch((error) => reject(error));
          });
    }

    async getCookies(token) {
        let req = fetch("https://planning.univ-rennes1.fr/direct/gwtdirectplanning/WebClientServiceProxy", {
            "headers": {
                "content-type": "text/x-gwt-rpc; charset=UTF-8",
                "x-gwt-permutation": ""
            },
            "body": `7|0|5|https://planning.univ-rennes1.fr/direct/gwtdirectplanning/|FE500F0EAC5A5732DFC902C566E7EBA7|com.adesoft.gwt.core.client.rpc.WebClientServiceProxy|method39isSsoConnected|J|1|2|3|4|1|5|${token}|`,
            "method": "POST",
        })

        return new Promise((resolve,reject) =>{
            req.then(
                (r)=>resolve(r.headers.getSetCookie())
            ).catch(e=>{
                reject(e)
            })
        })
    }

    async getProjects(token,cookies){
        let req = fetch("https://planning.univ-rennes1.fr/direct/gwtdirectplanning/WebClientServiceProxy", {
            "headers": {
                "content-type": "text/x-gwt-rpc; charset=UTF-8",
                "x-gwt-permutation": "",
                "Cookie":cookies
            },
            "body": `7|0|5|https://planning.univ-rennes1.fr/direct/gwtdirectplanning/|FE500F0EAC5A5732DFC902C566E7EBA7|com.adesoft.gwt.core.client.rpc.WebClientServiceProxy|method4getProjectList|J|1|2|3|4|1|5|${token}|`,
            "method": "POST",
        });

        return new Promise((resolve,reject) =>{
            req.then(
                (r)=>resolve(r.text())
            ).catch(e=>{
                reject(e)
            })
        })
    }

    login(token,cookies){
        return fetch("https://planning.univ-rennes1.fr/direct/gwtdirectplanning/DirectPlanningServiceProxy", {
            "headers": {
              "content-type": "text/x-gwt-rpc; charset=UTF-8",
              "x-gwt-permutation": "",
              "Cookie":cookies
            },
            "body": `7|0|10|https://planning.univ-rennes1.fr/direct/gwtdirectplanning/|ED09B1B4CB67D19361C6552338791595|com.adesoft.gwt.directplan.client.rpc.DirectPlanningServiceProxy|method1login|J|com.adesoft.gwt.core.client.rpc.data.LoginRequest/3705388826|Z|com.adesoft.gwt.directplan.client.rpc.data.DirectLoginRequest/635437471|6e04da9212376a50dcd46bdf83c3daf09efd5d248a2e3916f42627774819aa817d2e06d8d5cfb9c7339c47c11e45703015d91a675bae602e1beb611b52bce81959e7b879f62e7da35f60d0ef5412004ee4358841a778c6a1ec506e4b3b16290a97a4a554d7264c73fac518a05f48da1054dbfd40d96f5fedc56848a0d7dc4b3f,1||1|2|3|4|3|5|6|7|${token}|8|0|9|0|0|0|10|10|-1|0|0|0|`,
        //avec login `7|0|9|https://planning.univ-rennes1.fr/direct/gwtdirectplanning/|ED09B1B4CB67D19361C6552338791595|com.adesoft.gwt.directplan.client.rpc.DirectPlanningServiceProxy|method1login|J|com.adesoft.gwt.core.client.rpc.data.LoginRequest/3705388826|Z|com.adesoft.gwt.directplan.client.rpc.data.DirectLoginRequest/635437471|                                                                                                                                                                                                                                                                   |1|2|3|4|3|5|6|7|ZKxbIUm |8|0|9|0|1|1| 9| 9|-1|0|0|0|`
            "method": "POST"
        });
    }

}

(async function(){
    let parser = new GetChildren()
    let cookies = await parser.getCookies()
    let token = "bite"//generateToken()

    let login = await parser.login(token,cookies)
    console.log(await login.text())

    let edts =  await parser.getProjects(token,cookies)
    console.log(parser.response_parser(await edts).slice(1))

    let req = await parser.fetch(`{"-100""true""-1""-1""-1""-1""0""false"[0]"""""0""0"[0][0]`, 0,cookies, token)
    console.log(parser.response_parser(await req).slice(1))
})()


// à la fin
//planning.univ-rennes1.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=1509&projectId=0&calType=ical&firstDate=2024-10-22&lastDate=2024-10-22