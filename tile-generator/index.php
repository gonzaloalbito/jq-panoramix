<?php
	error_reporting(E_ALL);
	ini_set("display_errors", "1");
	set_time_limit(900);
	session_start();
	require_once "ImageEditor.php";
	
	$imageUrl = "images/panoramix.jpg";
	$imageName = "pano";
	$imageExt = "jpg";
	$output = "images/demo/";
	$cropChar="-";
	$cropSize = 256;
	$panoHeight = 600;
	$currentZoom = 100;
	$zoomStep = 25;
	$zoomMax = false;
	
	function createPano($imagePath, $saveFolder, $height, $fileName, $fileExt="jpg", $cropSize=256, $zoomStep=25, $currentZoom=100, $zoomMax=false, $cropChar="-")
	{
		$image = ImageEditor::openImage($imagePath);
		if($image)
		{
			$sourceWidth = imagesx($image);
			$sourceHeight = imagesy($image);
			$scale = $height/$sourceHeight;
			$ratio = $sourceHeight/$height;
			$sourceZoom = $ratio*$currentZoom;
			$width = $scale*$sourceWidth;
			if(!is_dir($saveFolder))
			{
				mkdir($saveFolder);
			}
			$savePath = $saveFolder.$fileName.".".$fileExt;
			
			$tempImage = ImageEditor::resizeImage($image, $width, $height);
			if($tempImage && ImageEditor::saveImage($tempImage, $savePath))
			{
				echo "<p>Base image saved. Image size: ".$cropWidth."x".$cropHeight."px. Image path: ".$savePath."</p>";
				$zoomMax = ($zoomMax && $zoomMax>0 && $zoomMax<$sourceZoom)? $zoomMax : $sourceZoom;
				for($i=$currentZoom+$zoomStep; $i<$zoomMax; $i+=$zoomStep)
				{
					$step = $i;
					$ratio = $i/$currentZoom;
					$stepWidth = $ratio*$width;
					$stepHeight = $ratio*$height;
					$stepScale = $stepHeight/$sourceHeight;	//TODO Innecesario.
					$tempImage = ImageEditor::resizeImage($image, $stepWidth, $stepHeight);
					if($tempImage)
					{
						$stepFolder = $saveFolder.$step."/";
						if(!is_dir($stepFolder))
						{
							mkdir($stepFolder);
						}
						
						$stepWidth = imagesx($tempImage);
						$stepHeight = imagesy($tempImage);
						$cropXCount = $stepWidth/$cropSize;
						$cropXRest = $stepWidth%$cropSize;
						$cropYCount = $stepHeight/$cropSize;
						$cropYRest = $stepHeight%$cropSize;
						
						for($x=0; ($x<$cropXCount || ($x==$cropXCount && $cropXRest>0)); $x++)
						{
							$cropX = $x*$cropSize;
							$cropWidth = ($x==$cropXCount)? $cropXRest : $cropSize;
							for($y=0; ($y<$cropYCount || ($y==$cropYCount && $cropYRest>0)); $y++)
							{
								$cropY = $y*$cropSize;
								$cropHeight = ($y==$cropYCount)? $cropYRest : $cropSize;
								$cropImage = ImageEditor::cropImage($tempImage, $cropWidth, $cropHeight, $cropX, $cropY);
								
								$savePath = $stepFolder.$x.$cropChar.$y.".".$fileExt;
								if(ImageEditor::saveImage($cropImage, $savePath))
								{
									echo "<p>Cutting step ".$step.": Image coordinates x=".$x.", y=".$y.". Image size: ".$cropWidth."x".$cropHeight."px. Image path: ".$savePath."</p>";
								}
								else
								{
									echo "<h4>ERROR: Cannot save image generated in step ".$step.": Image coordinates x=".$x.", y=".$y.". Image size: ".$cropWidth."x".$cropHeight."px. Image path: ".$savePath."</h4>";
								}
							}
						}
					}
				}
				echo "<h4>END!!!<h4>";
			}
			else
			{
				echo "<h4>ERROR: Cannot save base image. Image size: ".$cropWidth."x".$cropHeight."px. Image path: ".$savePath."</h4>";
			}
		}
	}
	
?>
<!DOCTYPE html>
<html>   
	<head>
		<title>Panoramix image tile generator</title>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0">
		<meta name="description" content="" />
		<meta name="author" content="Gonzalo Albito Méndez Rey" />
	</head>
	<body>
		<h2>Tile generator</h2>
		<h3>Image: <?php echo $imageUrl;?></h3>
		<h4>Output: <?php echo "$output | $imageName | .$imageExt | $cropChar";?></h4>
		<h4>Size: <?php echo "$panoHeight | $cropSize x $cropSize";?></h4>
			<?php
				createPano($imageUrl, $output, $panoHeight, $imageName, $imageExt, $cropSize, $zoomStep, $currentZoom, $zoomMax, $cropChar);
			?>
	</body>
</html>
