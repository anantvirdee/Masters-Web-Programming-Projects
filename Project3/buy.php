<?php session_start();
$totalPrice=0.0;

?>

<html>
<head><title>Buy Products</title></head>
<body>
<p id="shopcart"><?php cart(); ?></p>

<?php
$page='buy.php';

error_reporting(E_ALL);
ini_set('display_errors','On');
$nameErr = "";
if(isset($_GET['search'])){
$query = urlencode($_GET["search"]);
$xmlstr = file_get_contents('http://sandbox.api.ebaycommercenetwork.com/publisher/3.0/rest/GeneralSearch?apiKey=78b0db8a-0ee1-4939-a2f9-d3cd95ec0fcc&trackingId=7000610&keyword='.$query);       
$xml = simplexml_load_string($xmlstr);
}
//$arrlength1=count($xml->categories->category->items->product);


if(isset($_SESSION['main']))
//When user clicks add item
{


if(isset($_GET['add']))
{
$_SESSION['cart_'.$_GET['add']]="";
//var_dump($_GET['add']);
//var_dump($_SESSION['cart_'.$_GET['add']]);
$xmlGo=simplexml_load_string($_SESSION['main']);
$arrlength2=count($xmlGo->categories->category->items->product);

for($i=0;$i<$arrlength2;$i++)
{	
//echo "".$xmlGo->categories->category->items->product[$i]->minPrice;
if($xmlGo->categories->category->items->product[$i]->attributes()==$_GET['add'])
{

$_SESSION['cart_'.$_GET['add']]=$_SESSION['cart_'.$_GET['add']].'<tr><td><a href="'.$xmlGo->categories->category->items->product[$i]->productOffersURL.'">
<img src="'.$xmlGo->categories->category->items->product[$i]->images->image->sourceURL.'"></img></a></td>
<td>'.$xmlGo->categories->category->items->product[$i]->name.'</td><td>$'.$xmlGo->categories->category->items->product[$i]->minPrice.'</td>
<td><a href="buy.php?delete='.$_GET['add'].'">Delete</a></td></tr>';


}

}

header('Location: '.$page);
}
}
//echo $_SESSION['totalsum'];

foreach($_SESSION as $name=>$value)
{

if(substr($name,0,5)=='cart_')
{
$cart_id=substr($name,5,(strlen($name)));
   $temp=substr($value, 400,strlen($value));
  //	echo strpos($temp, "$");
   $last=strlen($temp)-10;
  $temp1=substr($temp, strpos($temp,"$"),$last);
  //echo strlen($temp1);
  $temp2=substr($temp1,0,8);
  $dot=strpos($temp2,".");
  $temp3=substr($temp2, 1,$dot+2);
$totalPrice+=floatval($temp3);
}
}

if(isset($_GET['delete']))
{

$_SESSION['cart_'.$_GET['delete']]="";
header('Location: '.$page);
}

//echo '<p id="cart"></p>';
echo "<p>Total:".$totalPrice."$</p>";

if(isset($_GET["clear"])==1)
{
$_GET["clear"]=0;
session_destroy();
header('Location: '.$page);
}

echo '<form action="buy.php" method="GET"> <input type="hidden" name="clear" value="1"/> <input type="submit" value="Empty Basket"/> </form>';

echo '<p> <form action="buy.php" method="GET"> <fieldset><legend>Find products:</legend>
 <label>Search for items: <input type="text" name="search"/><label>
     <input type="submit" value="Search"/> </fieldset> </form> <p/>';

function cart()
{
echo '<table border="1">';
foreach($_SESSION as $name=>$value)
{

if(substr($name,0,5)=='cart_')
{
$cart_id=substr($name,5,(strlen($name)));
   echo  $value;
}
}
echo '</table>';


}
if(!empty($query))
{	  
echo '<table border="1">';
$_SESSION['main']=$xmlstr;
$xml1 = simplexml_load_string($xmlstr);
$arrlength1=count($xml1->categories->category->items->product);
for($i=0;$i<$arrlength1;$i++)
{	
$test=urlencode($xml->categories->category->items->product[$i]->attributes());
echo '<tr>';                              
echo '<td><a href="buy.php?add='.$test.'"><img src="'.$xml->categories->category->items->product[$i]->images->image->sourceURL.'"></img></a></td>';
echo '<td>'.$xml->categories->category->items->product[$i]->name.'</td>';
echo '<td>$'.$xml->categories->category->items->product[$i]->minPrice.'</td>';
echo "</tr>";
}
echo '</table>';
}
?>
</body>
</html>