#tpl.js

##简介

    tpl.js是一个比较极致(极小，极快，极简单)的js模板引擎，可以在各种js环境中使用。
##特性

1. 使用js作为模板语言，几乎无学习成本
2. 小巧，速度快到极致
3. 极简的语法，模板书写非常流畅
4. 兼容各种规范(amd,cmd) 
5. mit开源，无限制

##语法说明

###简述
tpl.js中模板语法中以行为单一，分为js行语句，和输出行语句。顾名思义，js行语句是编译时候会当做js执行的语句，
而输出行语句，则是会输出为html。

###具体语法
1. 以行为单位，每一行作为语句块，并去掉行前后空白字符
2. 如果行不是以<（左尖括号）开头，则视为js,如果不是，则视为该行为输出行
3. 如果行以!(叹号)开头，也视该行为输出行。如 !aa，但解析@{exp}表达式
4. 在输出行中通过@{exp}这样的表达式作为js变量输出。@{item.name}
5. 如果4中exp无特殊字符，如"、'、'<、 >等。则可以省略{}中括号。如@.item.name @.name @func(item) @list[i]
6. 如果行以!!2个叹号开头，则视该行为纯输出行，不解析@表达式，原样输出。如!!abc@def
7. 如果行中出现@又不想要tpl.js解析，则通过\转义。如\@abc
    
#示例
```html
<html>
<head>
<meta charset="utf8"/>
<script type="text/javascript" src="tpl.js"></script>
</head>
<body>
数据在本文件内
<div class="users">
	<script type="tpl">
			<table>
				for(var i=0;i<users.length;i++){
					var user = users[i];
						<tr>
    						<td>@user.name</td>
    						<td>@{user.age}year</td>
							<td>@user.sex</td>
							<td>@user.email\@126.com<td>
						</tr>
				}
			<table>
	</script>
</div>

<p></p>
通过ajax获取数据<br>
<script type="tpl" data-data-url='./users.js'>
	!!@D.length原样输出<br/>
	!@D.length解析输出<br/>
	 <select>
			for(var i=0;i<D.length;i++){
					var user = D[i];
						<option value="@user.age" age="@user.age">
							@.name
						</option>
			}
	 </select>
</script>
 
<div id="result">

</div>


通过ajax获取数据<br>
<script type="tpl" id="id" data-data-url='./users.js' data-tpl-url='./u.html?v'>

</script>
 


<script type="text/javascript">
	var beg = new Date().getTime();
    var users=[
        {
            name:'name',
            age:12,
            sex:'boy',
            email:'nimei'
        }, {
            name:'name1',
            age:12,
            sex:'boy',
            email:'nimei'
        }
    ];
		
    tpl.render(); //自动渲染整个网页中的<script type="tpl">模板
    
    var tplText= "<ul>\n"
                +"for(var i=0;i<tplData;i++){\n"
                + "<li>@i</li>\n"
                +"}\n"
                + "<ul>\n";
	/*
    var func = tpl.func(tplText); //将模板编译成一个函数，模板里面通过D变量获取参数
    var html = func(12);//调用模板函数，并传递参数12，在模板里面D就是12
    document.getElementById('result').innerHTML=html; //将生成的html设置为网页
    */
	
	var html = tpl.html(tplText,12);//直接传递模板与参数,获取html
	document.getElementById('result').innerHTML=html;
    document.write("时间："+ (new Date().getTime()-beg).toString() +"毫秒");
</script>
</body>
</html>
```

##API
* tpl.html(tplText,daata)
    
    通过传递tplText模板，和数据data直接获取模板生成的html代码。

* tpl.func(tplText)
    
    将tplText编译为一个函数，该函数参数在模板中通过D参数引用。 调用后返回模板编译后的html代码。

* tpl.render(nodes,finishCallBack)

    自动渲染整个网页中的&lt;script type="tpl"&gt;标签中的模板。并能保证html dom中原有的结构。相当于替换掉了原来的&lt;script type="tpl"&gt;标签,如果不想该模板被渲染，增加norender属性即可。
	如果未传入nodes，则渲染所有&lt;script type="tpl"&gt;标签, 如果传入nodes则只选择nodes标签，并忽略norender属性
	
* tpl.serv(tplUrl,data,callback) 
	
	通过传递模板地址，和数据，获取模板生成的html代码， callback第一个参数就是编译后的html代码

###最后
上面的文档包括了tpl.js所有的语法了，欢迎大家测试与反馈。
源码地址:https://git.oschina.net/tianqiq/tpl.js