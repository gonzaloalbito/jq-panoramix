<?php
	class ImageEditor
	{
		
		public static function resizeImage($image, $width, $height)
		{
			$result = false;
			if($image && $width>0 && $height>0)
			{
				$sourceWidth = imagesx($image);
				$sourceHeight = imagesy($image);
				$tempImage = imagecreatetruecolor($width, $height);
				$value = imagecopyresampled($tempImage, $image, 0, 0, 0, 0, $width, $height, $sourceWidth, $sourceHeight)? $tempImage : $value;
			}
			return $value;
		}
		
		
		public static function resizeImageFile($imagePath, $savePath=false, $width, $height)
		{
			$value = false;
			$savePath = $savePath? $savePath : $imagePath;
			$image = ImageEditor::openImage($imagePath);
			if($image)
			{
				$tempImage = ImageEditor::resizeImage($image, $width, $height);
				if($tempImage && ImageEditor::saveImage($tempImage, $savePath))
				{
					$value = $savePath;
				}
			}
			return $value;
		}
		
		
		public static function scaleImage($image, $scale)
		{
			$value = false;
			if($image)
			{
				$sourceWidth = imagesx($image);
				$sourceHeight = imagesy($image);
				$width = $sourceWidth*$scale;
				$height = $sourceHeight*$scale;
				$value = ImageEditor::resizeImage($image, $width, $height);
			}
			return $value;
		}
		
		
		public static function scaleImageFile($imagePath, $savePath=false, $scale)
		{
			$value = false;
			$savePath = $savePath? $savePath : $imagePath;
			$image = ImageEditor::openImage($imagePath);
			if($image)
			{
				$tempImage = ImageEditor::scaleImage($image, $scale);
				if($tempImage && ImageEditor::saveImage($tempImage, $savePath))
				{
					$value = $savePath;
				}
			}
			return $value;
		}
		
		
		public static function cropImage($image, $width, $height, $x=0, $y=0)
		{
			$value = false;
			if($image && $width>0 && $height>0 && $x>=0 && $y>=0)
			{
				$sourceWidth = imagesx($image);
				$sourceHeight = imagesy($image);
				if($x+$width>$sourceWidth)
				{
					$width = $sourceWidth-$x;
				}
				if($y+$height>$sourceHeight)
				{
					$height = $sourceHeight-$y;
				}
				if(($x+$width<=$sourceWidth) && ($y+$height<=$sourceHeight))
				{
					$tempImage = imagecreatetruecolor($width, $height);
					$value = imagecopyresampled($tempImage, $image, 0, 0, $x, $y, $width, $height, $width, $height)? $tempImage : $value;
				}
			}
			return $value;
		}
		
		
		public static function cropImageFile($imagePath, $savePath=false, $width, $height, $x=0, $y=0)
		{
			$value = false;
			$savePath = $savePath? $savePath : $imagePath;
			$image = ImageEditor::openImage($imagePath);
			if($image)
			{
				$tempImage = ImageEditor::cropImage($image, $width, $height, $x, $y);
				if($tempImage && ImageEditor::saveImage($tempImage, $savePath))
				{
					$value = $savePath;
				}
			}
			return $value;
		}
		
		
		public static function openImage($imagePath)
		{
			$image = false;
			if(file_exists($imagePath))
			{
				$type = ImageEditor::getImageType($imagePath);
				switch($type)
				{
					case IMAGETYPE_JPEG:
						$image = imagecreatefromjpeg($imagePath);
						break;
					case IMAGETYPE_PNG:
						$image = imagecreatefrompng($imagePath);
						break;
					case IMAGETYPE_GIF:
						$image = imagecreatefromgif($imagePath);
						break;
					case IMAGETYPE_BMP:
						$image = imagecreatefromwbmp($imagePath);
						break;
					
					default:
						break;
				}
			}
			return $image;
		}
		
		
		public static function saveImage($image, $savePath, $type=false)
		{
			$value = false;
			if($image)
			{
				if(!ImageEditor::checkImageType($type))
				{
					$file = pathinfo($savePath);
					switch(strtolower($file["extension"]))
					{
						case "jpeg":
						case "jpg":
							$type = IMAGETYPE_JPEG;
							break;
						case "png":
							$type = IMAGETYPE_PNG;
							break;
						case "gif":
							$type = IMAGETYPE_GIF;
							break;
						case "bmp":
							$type = IMAGETYPE_BMP;
							break;
						
						default:
							break;
					}
				}
				switch($type)
				{
					case IMAGETYPE_JPEG:
						$value = imagejpeg($image, $savePath);
						break;
					case IMAGETYPE_PNG:
						$value = imagepng($image, $savePath);
						break;
					case IMAGETYPE_GIF:
						$value = imagegif($image, $savePath);
						break;
					case IMAGETYPE_BMP:
						$value = imagewbmp($image, $savePath);
						break;
							
					default:
						break;
				}
			}
			return $value;
		}
		
		public static function checkImage($imagePath)
		{
			return ImageEditor::getImageType($imagePath);
		}
		
		
		public static function checkImageType($imageType)
		{
			$value = ($imageType && in_array($imageType, array(IMAGETYPE_JPEG, IMAGETYPE_PNG, IMAGETYPE_GIF, IMAGETYPE_BMP)));
			return $value? $imageType : $value;
		}
		
		
		public static function getImageType($imagePath)
		{
			$imageType = false;
			$data = getimagesize($imagePath);
			if($data)
			{
				$imageType = $data[2];
			}
			return ImageEditor::checkImageType($imageType);
		}
	}
?>