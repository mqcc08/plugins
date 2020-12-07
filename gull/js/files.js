
var loading;
$(function () {
    $(".div-upload").addClass("hide")
    $(".btn-refresh").click(function () {
        //window.location.href = window.location.href;
        refresh();

    })

    $(".btn-upload").click(function () {
        var dataIndex = $(this).attr("data-index");
        if (dataIndex == 0){
            $(".div-upload").removeClass("hide");
            $(this).attr("data-index","-1");
            $(this).text("取消上传");
        }else{
            $(".div-upload").addClass("hide");
            $(this).attr("data-index","0");
            $(this).text("上传文件");
        }
    })

    $(".btn-select-file").click(function () {
        $(".input-file").click();
    })

    $(".span-file").click(function () {
        var accordions = getAccordionsAsc($(".accordion-item span"));
        var queryDataSha = $(this).attr("data-sha");
        var queryText = $(this).text();

        var accordionItem = { name : $.trim(queryText), sha : $.trim(queryDataSha) };
        accordions.push(accordionItem);
        console.log(accordions)
        loadFiles(queryDataSha , accordions);
    })


    $(".table-header-navigate .accordion span").click(function () {
        var prevAll = $(this).parent(".accordion-item").prevAll();
        var accordions = getAccordionsDesc($(prevAll));
        var queryDataSha = $(this).attr("data-sha");
        var queryText = $(this).text();
        var accordionItem = { name : $.trim(queryText), sha : $.trim(queryDataSha) };
        accordions.push(accordionItem);
        console.log(accordions)
        loadFiles(queryDataSha , accordions);
    })

    $(".btn-pre-image").click(function () {
        preImage($(this).attr("data-sha") , $(this).attr("data-name"));
    })
})
function preImage(sha , name) {

    loading = $.loading();
    httpClient.post("/api/gitee/preImage" , {sha : sha } , function (data) {
        $.unloading(loading);
        if (data.code == 200){


            var srcFormate = "";

            var expandName = name.substring(name.lastIndexOf(".") +1 , name.length);

            console.log(expandName)


            var element;
            if ("txt" == expandName.toLocaleLowerCase()){
                srcFormate+="data:text/plain;base64,";

                element = document.createElement("txt");
            }else{
                element = document.createElement("img");

                srcFormate+="data:image/png;base64,";
            }
            srcFormate += data.data.fileString;
            element.setAttribute("src",srcFormate);


            $(".pre-image .div-pre-image").empty().append(element);


            var accordionsPath = getAccordionsPath($(".accordion-item span"));
            $(".other-link").val(data.data.doname+ accordionsPath+name)
            $.openDialog("图片预览" , $(".pre-image") , "l" , function () {
                layer.closeAll();
            })
        }
    })
}

function refresh() {
    var accordions = getAccordionsAsc($(".accordion-item span"));
    window.location.href= "/refresh?accordions="+base.encode(JSON.stringify(accordions));
}

function getAccordionsDesc(object) {
    var accordions = [];
    for (var i = $(object).length ; i >=0 ; i--){
        var parentObject = $(object)[i];
        var element = $(parentObject).children("span");
        var queryText = $.trim($(element).text());
        var queryDataSha = $.trim($(element).attr("data-sha"));
        if (queryText != ""){
            var accordionItem = { name : queryText, sha : queryDataSha };
            accordions.push(accordionItem);
        }
    }
    return accordions;
}

function getAccordionsAsc(object) {
    var accordions = [];
    $.each( $(object), function (index , $Element) {
        var queryText = $.trim($($Element).text());
        queryText = queryText.replace(">","");
        var queryDataSha = $.trim($($Element).attr("data-sha"));
        if (queryText != ""){
            var accordionItem = { name : queryText, sha : queryDataSha };
            accordions.push(accordionItem);
        }
    })
    return accordions;
}

function getAccordionsPath(object) {
    var accordionPath="";
    $.each( $(object), function (index , $Element) {
        var queryText = $.trim($($Element).text());
        queryText = queryText.replace(">","");
        if (queryText != "" && queryText !="根目录"){
            accordionPath += queryText+"/"
        }
    })
    return accordionPath;
}




function loadFiles(sha , accordions) {
    var stringify = JSON.stringify(accordions);
    console.log("sha : "+sha+" ,params:"+stringify)
    accordions = base.encode(stringify);

    if (sha == undefined || sha=="undefined" ){
        sha = "";
    }
    window.location.href="?sha="+sha+"&accordions="+accordions;
}



function deleteFiles() {

}