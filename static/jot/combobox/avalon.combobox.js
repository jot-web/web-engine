// avalon 1.3.6
/**
 * @enName combobox
 * @introduce
 */
define(["avalon", "text!./avalon.combobox.html", "css!./avalon.combobox.css", "./mmRequest"], function(avalon, template) {

    var undefine = void 0

    var widget = avalon.ui.combobox = function (element, data, vmodels) {
        var options = data.comboboxOptions,
        $element = avalon(element),
        vmId = data.comboboxId;
        options.template = options.getTemplate(template, options);

        var async = {
            enable: false,
            url: "",
            contentType: "application/x-www-form-urlencoded",
            dataType: "json",
            autoParam: [],
            dataFilter: undefine,
            otherParam: {},
            type: "post"
        }

        var inited, id = +(new Date());

        options.pages = [{page:1, active:true}, {page:2, active:false},{page:3, active:false}];
        options.selectedText = '';
        options.selectedValue= '';
        options.previous = false;
        options.next = false;

        var vm = avalon.mix({
            $id : vmId,
            widgetElement : element,
            $skipArray : ["widgetElement", "template"],
            $uid : id,
            items:[],
            currentPage:1,
            changePage: function (e, page) {
                changePageAction(page);
                e.stopPropagation();
            },
            selectedItem: function (value, text) {
                vmodel.selectedText = text;
                vmodel.selectedValue = value;
            },
            nextPage: function (e) {
                e.stopPropagation();
                if(vmodel.next) return;
                vmodel.currentPage++;
                getServerData();
            },
            prevPage: function (e) {
                e.stopPropagation();
                if(vmodel.previous) return;
                vmodel.currentPage--;
                getServerData();
            },
            $init :  function (continueScan) {
                if (inited) return;
                inited = true;
                vmodel.template = vmodel.template.replace(/\{\{MS_COMBOX_ID\}\}/g, id);
                element.innerHTML = vmodel.template;

                setItems();
                if (continueScan) {
                    continueScan();
                }
            }
        }, options);

        var vmodel = avalon.define(vm);

        function changePageAction(page){
            vmodel.currentPage = page;
            for(var i = 0; i < vmodel.pages.length; i++){
                if(page == vmodel.pages[i].page){
                    vmodel.pages[i].active = true;
                }else{
                    vmodel.pages[i].active = false;
                }
            }

            // 切换页码刷新数据
            getServerData();

        }

        function getServerData(){
            async.url = vmodel.url;
            var data = {
                pagesize: vmodel.pageSize,
                pageindex: vmodel.currentPage
            }
            avalon.ajax(avalon.mix({
                    data: data
                },
                async)).done(function(res) {
                if(typeof(res) === 'object'){
                    vmodel.total = res.total;
                    vmodel.items = res.options;
                    vmodel.total = 61;
                    resetPages(vmodel.total);
                }else{
                    new Error("远程数据错误"+res);
                }

            });
        }

        function resetPages(total){
            var currentPage = vmodel.currentPage;
            var totalPage = Math.ceil(total/vmodel.pageSize);
            var showPages = vmodel.showPages;
            var bottom = (Math.floor((currentPage-1)/showPages))*showPages+1;
            var top = (Math.floor((currentPage-1)/showPages))*showPages+showPages;
            top = top <= totalPage?top:totalPage;

            vmodel.pages.splice(0, vmodel.pages.length);

            for(var i = bottom; i <= top; i++){
                var page = {page:i};
                if(i == currentPage){
                    page.active = true;
                }
                vmodel.pages.push(page);
            }

            if(currentPage == 1){
                vmodel.previous = true;
            }else{
                vmodel.previous = false;
            }
            if(currentPage == totalPage){
                vmodel.next = true;
            }else{
                vmodel.next = false;
            }
        }

        function setItems(){
            if(vmodel.localData && vmodel.dataType == 'local'){
                vmodel.items = vmodel.localData;
            }else if(vmodel.dataType == 'server' && vmodel.url ){
                getServerData();
            }else{
                new Error("数据配置错误");
            }
        }
        return vmodel;
    };

    widget.defaults = {
        /**
         * dataType:数据来源类型 local or server
         * */
        dataType:'server',
        /**
         * localData:本地数据
         * 格式:{value:'', text:''}
         * */
        localData:[{value:1, text:'安徽'}, {value:2, text:'江苏'}],
        /**
         * url: 远程数据url
         * */
        url:'./data.json',
        /**
         * currentPage: 当前页码
         * */
        currentPage:1,
        /**
         * total: 记录总条数
         * */
        total: 0,
        /**
         * pageSize: 分页大小
         * */
        pageSize:10,
        /**
         * showPages: 每页显示的页码数
         * */
        showPages:3,
        /**
         * id: combobox对应属性名称
         * */
         id:'province',
        getTemplate: function (str, options) {
            return str;
        }
    };

    return avalon;
});

/**
  //遍历数组元素，依次处理
  [].forEach(function (dataItem, index) {
      if (dataItem.selected) {
          selectedData.push(dataItem);
      }
  });

  //监听view model中属性的变化
  vmodel.$watch("scrollerHeight", function(n) {

  //解析字符串模板为dom对象
  var dom = avalon.parseHTML(options.template);
  });

  //组件嵌套时 外部组件向内部组件传值
  var duplexVM = avalon.getModel(options.duplex, [vmodel].concat(vmodels)),
  duplexArr = duplexVM && duplexVM[1][duplexVM[0]]

   //新建dom元素
   popup = popup || document.createElement("div");
   popup.innerHTML = options.template;
   document.body.appendChild(popup)

   //抽取data-tooltip-text、data-tooltip-attr属性，组成一个配置对象
   var widgetData = avalon.getWidgetData(elem, widget)
*/
