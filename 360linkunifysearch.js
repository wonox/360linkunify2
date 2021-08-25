const fetch = require("node-fetch");
const convert = require('xml-js');
const JsonFind = require("json-find");
const util = require('util');
var jp = require('jsonpath');
// https://www.npmjs.com/package/json-find
// cf.node xml2jsontest5.js -d 10.1080/01930826.2015.1105041 --format json 

const program = require('commander');
// const { ENGINE_METHOD_PKEY_ASN1_METHS } = require("constants");

/*base URL of libraries' 360Core*/
const portal = [
    { "base": "http://te7fv6dm8k", "name": 'University of Texas at Austin', "namae": ' University of Texas at Austin' }
    ,
    { "base": "http://wa4py6yj8t", "name": 'Yale University Library ', "namae": ' Yale University Library' },
    { "base": "http://ck3cc4bu9u", "name": 'doshisha univ.', "namae": '同志社大学' },
    { "base": "http://mx9kp2xn4f", "name": 'chuo univ.', "namae": '中央大学' }
    ,
    { 'base': 'http://tm3xa4ur3u', 'name': 'waseda univ.', 'namae': '早稲田大学' },
    { 'base': 'http://ax5kr6fu7r', 'name': 'jochi(sophia)univ.', 'namae': '上智大学' },
    { 'base': 'http://cv8kl8wa9k', 'name': 'rikkyo(St.Paul)univ. ', 'namae': '立教大学' },
    { 'base': 'http://te8rl7nq6r', 'name': 'kyushu univ', 'namae': '九州大学' },
    { 'base': 'http://uj3nm4eq5h', 'name': 'nagaoka univ.', 'namae': '長岡技術科学大学' },
    { 'base': 'http://qp4wz6vz5k', 'name': 'chiba univ.', 'namae': '千葉大学' },
    { 'base': 'http://yk2pw4vj9e', 'name': 'hitotsubashi univ.', 'namae': '一橋大学' },
    { 'base': 'http://vs2ga4mq9g', 'name': 'tokyo univ.', 'namae': '東京大学' },
    { 'base': 'http://ec2xm3xr4v', 'name': 'tohoku univ.', 'namae': '東北大学' },
    { 'base': 'http://jg8gn6xr5x', 'name': 'hokkaido univ.', 'namae': '北海道大学' },
    { 'base': 'http://gk4ku3rq6c', 'name': 'shigaika univ.', 'namae': '滋賀医科大学' },
    { 'base': 'http://sg3jk3se8d', 'name': 'ryukyu univ.', 'namae': '琉球大学' },
    { 'base': 'http://hz9vd5wl2f', 'name': 'kumamoto univ.', 'namae': '熊本大学' },
    { 'base': 'http://nw5sg2bn2y', 'name': 'kagoshima univ.', 'namae': '鹿児島大学' },
    { 'base': 'http://yc6au9sr3t', 'name': 'ochanomizu univ.', 'namae': 'お茶の水女子大学' },
    { 'base': 'http://xx6ge5xn4a', 'name': 'hirosaki univ.', 'namae': '弘前大学' },
    { 'base': 'http://jn2xs2wb8u', 'name': 'tukuba univ.', 'namae': '筑波大学' },
    { 'base': 'http://ek9vk5wf7j', 'name': 'tokushima univ.', 'namae': '徳島大学' },
    { 'base': 'http://rn4ma3lk7u', 'name': 'dentsu(uec)univ.', 'namae': '電気通信大学' },
    { 'base': 'http://xv4nf5au5d', 'name': 'kochi univ.', 'namae': '高知大学' },
    { 'base': 'http://bl3bd7tc7s', 'name': 'tokyo ikashika univ.', 'namae': '東京医科歯科大学' },
    { 'base': 'http://wm3qp6kj6d', 'name': 'miyazaki univ.', 'namae': '宮崎大学' },
    { 'base': 'http://tt2mx4dc7s', 'name': 'kyoto univ.', 'namae': '京都大学' },
    { 'base': 'http://kx3ry9kp2c', 'name': 'tokyo noko univ.', 'namae': '東京農工大学' },
    { 'base': 'http://qq6az3es8a', 'name': 'kyoto kogei univ.', 'namae': '京都工芸繊維大学' },
    // { 'base': 'http://yj3bg6ng2l', 'name': 'hokuriku univ.', 'namae': '北陸先端科学技術大学院大学' }
    // { 'base': 'http://yj3eg6at9n', 'name': 'shimane univ.', 'namae': '島根大学' }, ebscoに切り替えた
    //    { 'base': 'http://xz9mz9lt2m', 'name': 'gifu univ.', 'namae': '岐阜大学' },ebscoに切り替えた
    //    { 'base': 'http://hy6nh4ag9e', 'name': 'wakayama univ.', 'namae': '和歌山大学' },EBSCOに切り替えた
    //    { 'base': 'http://gk4ku3rq6c', 'name': 'shiga univ.', 'namae': '滋賀大学' },EBSCOに切り替えた
];

// コマンドライン引数の処理
program
    .version('0.0.1')
    .usage('[options] cf: -d 10.1080/01930826.2015.1105041 --format json')
    .option('-d, --doi,  <n> [type]', 'cf.:10.1016/j.ajp.2020.102188')
    .option('-i, --issn, <n> [type]', 'cf.17448336', /^[0-9xX{8}]*$/i)
    .option('-f, --format, [format]', 'text or json', 'text')
    .parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
// onsole.log(`${options.doi}`);
if (options.doi) my2(`${options.doi}`);
if (options.issn) my1(`${options.issn}`);
// if (options.format) onsole.log(`- ${options.format}`); //引数の内容を表示する
// if (options.issn) onsole.log(`- ${options.issn}`);　//引数の内容を表示する

// xmlをjsonに変換して、必要な項目を取り出す
/* ＃.findValues（Object、... String）->オブジェクト
指定された各キーについて、指定されたオブジェクトを検索します。
特定のキーがオブジェクトに存在する場合、そのキーと値のペアが結果のオブジェクトにコピーされます。
一致するものがない場合は、空のオブジェクトが返されます。
複数の同一のキーを持つオブジェクトが与えられた場合、最初に見つかった一致するキーの値が返され、
他のキーは無視されます。
ただし、オブジェクト内の同じレベルに同一のキーが存在する場合は、最後のキーの値が返されます。
 */
function parseJSON(response) {
    const json_string = convert.xml2json(response, { compact: true, spaces: 3 });
    const from_json = JSON.parse(json_string);
    // const doc = JsonFind(json_string);
    const doc = JsonFind(from_json);
    // var names = jp.query(cities, '$..name');
    //let title = jp.query(from_json, "$..['dc:title']");
    //console.log(doc);
    let title = doc.findValues("dc:title"); //
    let creator = doc.findValues("dc:creator"); //
    // let creator = jp.query(from_json, "$..['dc:creator']"); // 
    // console.log(creator)
    let source = doc.findValues("dc:source"); // 
    let date = doc.findValues("dc:date"); //
    let issn = doc.findValues("ssopenurl:issn"); // 
    let eissn = doc.findValues("ssopenurl:eissn"); // 
    let volume = doc.findValues("ssopenurl:volume"); // 
    let issue = doc.findValues("ssopenurl:issue"); // 
    let spage = doc.findValues("ssopenurl:spage"); //
    let doi = doc.findValues("ssopenurl:doi"); //
    // let startDate = doc.findValues("ssopenurl:startDate"); //ssopenurl:startDate
    // let endDate = doc.findValues("ssopenurl:endDate");//ssopenurl:endDate
    // let providerName = doc.findValues("ssopenurl:providerName");//ssopenurl:providerName
    // let databaseName = doc.findValues("ssopenurl:databaseName");//ssopenurl:databaseName
    // このあたりがだめみたい
    // let linkGroup = doc.findValues("ssopenurl:linkGroup", "ssopenurl:providerName");//ssopenurl:providerName
    let linkGroup = doc.findValues("ssopenurl:linkGroup");//ssopenurl:providerName
    //
    let library = doc.findValues("ssopenurl:name"); // "ssopenurl:library"の下
    // const dcitem = [title, creator, source, date, issn, eissn, volume, issue, spage, doi, startDate, endDate, providerName, databaseName, library, linkGroup];
    const dcitem = [title, creator, source, date, issn, eissn, volume, issue, spage, doi, library, linkGroup]; //startDate, endDate, providerName, databaseName, 
    let arr = {};  // let arr = []; // const arr = [];
    dcitem.forEach(function (element) {
        // console.log("element: ", element);  // testtest
        //if element = linkGloup:
        //    console.log("element: ", element);  // testtest
        // elem[key]._text の形式の場合！getvalue(element)
        const dcterm = getvalue(element);
        for (var prop in dcterm) {
            if (dcterm.hasOwnProperty(prop) && prop == 1) {
                var innerObj = {};
                innerObj[dcterm[0]] = dcterm[1];
                arr = Object.assign(arr, innerObj);
            }
        }
    });
    return arr;
}   //  close  parseJSON

function getvalue(elem) {
    for (let key in elem) {
        // console.log(key)
        if (key == 'ssopenurl:linkGroup') {
            const dcholding = ['ssopenurl:databaseName', 'ssopenurl:providerName']; //
            /* console.log(jp.query(elem, "$..['ssopenurl:databaseName']")); // var authors = jp.query(data, '$..author');
                [
                  { _text: 'Education Research Complete' },
                  { _text: 'Taylor & Francis Online' }
                ]
            */
            // let linkgroup_text = jp.query(elem, "$..['ssopenurl:databaseName']")
            let linkgroup_text = jp.query(elem, "$..['ssopenurl:linkGroup']")
            /*
            const linkgroup_text2 = Object.keys(linkgroup_text).filter((key) => {
                return linkgroup_text[key] === '_text'
            });
            */
            // linkgroup_text2 = findVal(linkgroup_text, '_text');
            let linkgroup_text2 = jp.query(linkgroup_text, "$..['ssopenurl:holdingData']")
            let linkgroup_text3 = jp.query(linkgroup_text, "$..['ssopenurl:url']")
            const linkgroup_text4 = {
                ...linkgroup_text2, url: linkgroup_text3
            };  //オブジェクトに新しいプロパティを追加する
            // const linkgroup_text4 = mergeDeeply(linkgroup_text2, linkgroup_text3, { concatArray: true });
            const dcitem = [key, linkgroup_text4];
            return dcitem;
        } else {
            const dcitem = [key, elem[key]._text];
            return dcitem;
        }
        // return dcitem;
    }
}

/* 引数　-i --issn の時 */
function my1(issn) {
    issn === 'true' ? console.log('ISSNではない') : issn;
    // let baseurl = 'http://te7fv6dm8k.openurl.xml.serialssolutions.com/openurlxml?version=1.0&ctx_ver=Z39.88-2004&ctx_enc=info:ofi/enc:UTF-8&rft.issn=';
    let baseurl = '.openurl.xml.serialssolutions.com/openurlxml?version=1.0&ctx_ver=Z39.88-2004&ctx_enc=info:ofi/enc:UTF-8&rft.issn=';
    baseurl += String(issn);
    main(baseurl);
};

/* 引数　-d --doi の時 */
function my2(doi) {
     let baseurl = '.openurl.xml.serialssolutions.com/openurlxml?version=1.0&ctx_ver=Z39.88-2004&ctx_enc=info:ofi/enc:UTF-8&rft_id=info:doi/';
     baseurl += doi;
    main(baseurl);
};


var json_result = {};
function namaeb(res, namae) {
    json_result[namae] = parseJSON(res);
    return json_result;
}

//（A)Async関数を定義 - asyncSample()
async function asyncSample(baseurl, namae) {
    //(B)非同期処理を記載（結果はPromise(resolve)で処理）
    try {
        // const result = await fetchurl(baseurl, namae);
        const result = await fetch(baseurl);
        const json = await result.text();
        //(C)awaitで非同期処理の結果を待つ
        //resultの処理が返ったら関数の呼び出し元に返す
        return await namaeb(json, namae);
    } catch (e) {
        console.error(e); // 
    }
}
let kaisu = 0;
function main(opurl) {
    for (const i in portal) {
        const baseurl = portal[i]['base'] + opurl;
        const namae = portal[i]['namae'];

        //(A')Async関数を呼び出して処理    
        asyncSample(baseurl, namae).then(res => {
            // 最後の結果だけを取り出すため、呼び出しの回数を数える
            if (res) {
                kaisu++;
            }
            if (kaisu == portal.length - 1) {
                // onsole.log(res);
                disp_result(json_result);
                // disp_result(res);
            }
        });
    }  // for close
} // close_main

/* 結果の表示 */
function disp_result(arr) {
    if (options.format == 'json') {
        // onsole.log('ここのarr', namae, arr);
        // arr ? onsole.log(util.inspect(arr, {showHidden: false, depth: null})) : "";
        console.log(JSON.stringify(arr, null , "\t")); // どっちか？
    } else {
        plotres(arr, "")
    }
}

function plotres(response, prefix) {
    for (var key in response) {
        if (typeof response[key] == "object") {
            if (Array.isArray(response[key])) {
                // 配列の場合は forEach で要素ごとにに再帰呼び出し
                response[key].forEach(function (item) {
                    plotres(item, prefix + " " + key);
                });
            } else {
                // 連想配列はそのまま再帰呼び出し
                plotres(response[key], prefix + " " + key);
            }
        } else {
            // 配列や連想配列でなければキーの値を表示
            console.log(prefix + " " + key + ": " + response[key]);
        }
    }
}

function findVal(object, key) {
    var value;
    Object.keys(object).some(function (k) {
        if (k === key) {
            value = object[k];
            return true;
        }
        if (object[k] && typeof object[k] === 'object') {
            value = findVal(object[k], key);
            return value !== undefined;
        }
    });
    return value; function findVal(obj, key) {
        var seen = new Set, active = [obj];
        while (active.length) {
            var new_active = [], found = [];
            for (var i = 0; i < active.length; i++) {
                Object.keys(active[i]).forEach(function (k) {
                    var x = active[i][k];
                    if (k === key) {
                        found.push(x);
                     } else if (x && typeof x === "object" &&
                        !seen.has(x)) {
                        seen.add(x);
                        new_active.push(x);
                    }
                });
            }
            if (found.length) return found;
            active = new_active;
        }
        return null;
    }
}

// const url = 'http://te7fv6dm8k.openurl.xml.serialssolutions.com/openurlxml?version=1.0&ctx_ver=Z39.88-2004&ctx_enc=info:ofi/enc:UTF-8&rft_id=info:doi/10.1080/01930826.2015.1105041';
// let baseurl = 'http://te7fv6dm8k.openurl.xml.serialssolutions.com/openurlxml?version=1.0&ctx_ver=Z39.88-2004&ctx_enc=info:ofi/enc:UTF-8&rft_id=info:doi/';
// doi/10.1080/01930826.2015.1105041
// baseurl += '10.1080/01930826.2015.1105041';
// 10.1016/j.ajp.2020.102188
// 10.1080/01930826.2015.1105041
// PowerShell での実行権限付与
// Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
// nexe でjsを実行ファイル化
// nexe -t windows-x64-14.15.3 xml2jsontest7.js
// https://journal.code4lib.org/articles/108
// XML Response:
// https://developers.exlibrisgroup.com/360-services/apis/xml-response/