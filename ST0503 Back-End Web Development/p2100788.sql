CREATE DATABASE  IF NOT EXISTS `sp_it` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_it`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: localhost    Database: sp_it
-- ------------------------------------------------------
-- Server version	8.0.27

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `description` longtext,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (46,'Graphics Cards','High performance GPUs for gaming and video editing'),(47,'CPU','The brains of the computer. Whether you are on a budget or a big spender, we have a wide selection of CPUs for you.'),(48,'Monitors','High quality monitors for the best experience, whether you are working, playing games or just watching a movie.'),(50,'Laptops','Portable and light laptops, good for productivity and gaming.'),(51,'SSD','Whether if you need a portable one or a replacement for your device, SP IT got you covered with our wide range of SSDs.');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productid` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` longtext NOT NULL,
  `categoryid` int NOT NULL,
  `brand` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`productid`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  KEY `fk_cat_id_idx` (`categoryid`),
  CONSTRAINT `fk_cat_id` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (60,'ASUS TUF Gaming NVIDIA GeForce RTX 3080 Ti','NVIDIA Ampere Streaming Multiprocessors: The building blocks for the world’s fastest, most efficient GPU, the all-new Ampere brings 2X the FP32 throughput and improved power efficiency\n2nd Generation RT Cores: Experience 2X the throughput of 1st gen RT Cores, plus concurrent RT and shading for a whole new level of ray tracing performance\n3rd Generation Tensor Cores: Get up to 2X the throughput with structural sparsity and advanced AI algorithms such as DLSS. Now with support for up to 8K resolution, these cores deliver a massive boost in game performance and all-new AI capabilities\nAxial-Tech Fan Design has been tuned up with more fan blades and a reversed rotational direction for the center fan\nDual Ball Fan Bearings can last up to twice as long as sleeve bearing designs\nMilitary-grade Capacitors and other TUF components enhance durability and performance\nGPU Tweak II provides intuitive performance tweaking, thermal controls, and system monitoring',46,'ASUS','2999','2022-02-04 14:30:33','productimg_1643956377566.jpg'),(62,'ASUS ROG STRIX GeForce RTX 2080Ti','With pump, tubing, and radiator integrated seamlessly under the shroud, the Matrix is cooler and quieter than air-cooled cards while taking up the same amount of space. An oversized heat spreader covers the GPU die and RAM to ensure the most critical components are kept cool. To top it all off, we included three of our industry-leading Axial-tech fans to push cool air through the radiator while simultaneously cooling the VRMs.',46,'ASUS','2139','2022-02-04 14:44:19','productimg_1643957068293.jpg'),(63,'AMD Radeon RX 6800 XT','Truly immersive gaming experiences with DirectX® 12 Ultimate\nA robust visual feature set enabled by AMD FidelityFX\nDraw out more detail with Radeon Image Sharpening\nOne click overclocking with Radeon™ Software Performance Tuning Presets',46,'AMD','1200','2022-02-04 14:52:16','productimg_1643957540882.jpg'),(64,'AMD Ryzen 5 3600X 6-Core, 12-Thread Unlocked','The world\'s most advanced processor in the desktop PC gaming segment\nCan deliver ultra-fast 100+ FPS performance in the world\'s most popular games\n6 Cores and 12 processing threads, bundled with the powerful AMD Wraith Spire cooler\n4.4 GHz Max Boost, unlocked for overclocking, 35 MB of game Cache, ddr-3200 support\nFor the advanced socket AM4 platform, can support PCIe 4.0 on x570 motherboards',47,'AMD','728','2022-02-04 14:53:59','productimg_1643957644842.jpg'),(65,'AMD Ryzen 5 5600X 6-core, 12-Thread Unlocked','AMD\'s fastest 6 core processor for mainstream desktop, with 12 processing threads\nCan deliver elite 100+ FPS performance in the world\'s most popular games\nBundled with the quiet, capable AMD Wraith Stealth cooler\n4.6 GHz Max Boost, unlocked for overclocking, 35 MB of cache, DDR-3200 support\nFor the advanced Socket AM4 platform, can support PCIe 4.0 on X570 and B550 motherboards',47,'AMD','352.40','2022-02-04 14:55:04','productimg_1643957796212.jpg'),(66,'Intel Core i7-12700KF Desktop Processor 12 Cores','Intel® Core® i7 3.60 GHz processor offers more cache space and the hyper-threading architecture delivers high performance for demanding applications with better onboard graphics and faster turbo boost\nThe Socket LGA-1700 socket allows processor to be placed on the PCB without soldering\n11 MB L2 and 25 MB L3 cache offers supreme performance for computation intensive apps\nIntel 7 Architecture enables improved performance per watt and micro architecture makes it power-efficient',47,'Intel','575','2022-02-04 14:58:33','productimg_1643957917077.jpg'),(67,'Intel Core i5-10600K Desktop Processor 6 Cores up to 4.8 GHz Unlocked','6 Cores / 12 Threads\nSocket Type LGA 1200\nUp to 4. 8 GHz Unlocked\nCompatible with Intel 400 series chipset based motherboards\nIntel Optane Memory Support',47,'Intel','370.80','2022-02-04 14:59:40','productimg_1643958010061.jpg'),(69,'ASUS ROG STRIX AMD Radeon RX 6700 XT','Axial tech Fan Design has been enhanced with more fan blades and a new rotation scheme\n2.9 slot design expands cooling surface area compared to last gen for more thermal headroom than ever before\nSuper Alloy Power II includes premium alloy chokes, solid polymer capacitors, and an array of high current power stages\nMaxContact heat spreader allows 2X more contact with the GPU chip for improved thermal transfer\nReinforced frame prevents excessive torsion and lateral bending of the PCB.FanConnect II equips a hybrid controlled fan header for optimal system cooling.Vented backplate prevents hot air from recirculating through the cooling array',46,'ASUS','1984','2022-02-05 13:34:29','productimg_1644039317186.jpg'),(70,'AMD Ryzen 7 5800X 8-core, 16-Thread Unlocked','AMD\'s fastest 8 core processor for mainstream desktop, with 16 procesing threads\nCan deliver elite 100+ FPS performance in the world\'s most popular games\nCooler not included, high-performance cooler recommended\n4.7 GHz Max Boost, unlocked for overclocking, 36 MB of cache, DDR-3200 support\nFor the advanced Socket AM4 platform, can support PCIe 4.0 on X570 and B550 motherboards',47,'AMD','509.50','2022-02-05 16:32:03','productimg_1644050168433.jpg'),(74,'AMD Ryzen 9 5900X 12-core, 24-Thread Unlocked Desktop Processor','The world\'s best gaming desktop processor, with 12 cores and 24 processing threads\nCan deliver elite 100-plus FPS performance in the world\'s most popular games\nCooler not included, high-performance cooler recommended. Max Temperature- 90°C\n4.8 GHz Max Boost, unlocked for overclocking, 70 MB of cache, DDR-3200 support\nFor the advanced Socket AM4 platform, can support PCIe 4.0 on X570 and B550 motherboards',47,'AMD','697.90','2022-02-05 16:43:56','productimg_1644051606162.jpg'),(75,'Intel Core i9-10900K Desktop Processor 10 Cores up to 5.3 GHz Unlocked','10 Cores / 20 Threads\nSocket type LGA 1200\nUp to 5. 3 GHz unlocked\nCompatible with Intel 400 series chipset based motherboards\nIntel Turbo Boost Max Technology 3. 0 support.Intel Optane Memory support',47,'Intel','824.10','2022-02-05 17:13:35','productimg_1644052480130.jpg'),(80,'Samsung Odyssey G7','27-inch desktop monitor with 3-sided bezel-less screen for maximum viewing and a sleek, modern Y-shaped stand – perfect for a dual monitor set-up\nFull HD 1920 x 1080 resolution with a 16:9 aspect ratio. IPS panel delivers deep blacks, vivid colors, and a wide viewing angle, while Eye Saver Mode and Flicker-Free technology help minimize eye strain during long working hours',48,'Samsung','2400','2022-02-07 02:57:19','productimg_1644173881891.jpg'),(81,'ASUS ZenScreen Touch MB16AMT FHD IPS USB Micro-HDMI Portable Monitor, 15.6\" Black','15.6-Inch Full HD portable IPS display with an ultraslim 9 mm profile\nResponsive and intuitive input with 10-point touch functionality supports high-productivity multitasking',48,'ASUS','665','2022-02-07 03:00:14','productimg_1644174126008.jpg'),(83,'SAMSUNG LC27F390FHEXXS 27\" CURVED MONITOR,Dark Blue Gray','27\" Essential Curved Monitor CF390 with immersive viewing experience\n27\" Super Slim Curved Screen\nImmersive viewing experience\nContrast Ratio: 3000:1',48,'Samsung','324.22','2022-02-07 03:02:59','productimg_1644174270229.jpg'),(84,'Acer Swift 1 SF114-34-C2VS (Silver) 14\" Laptop - Preloaded Microsoft Office 365 personal','14\" FHD IPS Narrow Border Display\nIntel Celeron N5100 Processor\nWindows 10 in S Mode\n4GB RAM LPDDR, 128GB SSD Storage',50,'Acer','535','2022-02-07 03:05:19','productimg_1644174394299.jpg'),(85,'Acer Nitro 5 AN515-45-R553 15.6 inch FHD IPS Gaming Laptop AMD Ryzen 7 5800H NVIDIA GTX1650 Graphic,Black','AMD Ryzen 7 5800H\nWindows 10 Home (64-bit)\nNVIDIA GeForce GTX1650 4GB GDDR6\n15.6\" FHD IPS 144Hz 45%NTSC LED backlit TFT LCD\n8GB DDR4 3200MHz RAM, 512GB PCIe SSD',50,'Acer','1498','2022-02-07 03:09:17','productimg_1644174625760.jpg'),(86,'ASUS Laptop L210 Ultra Thin Laptop, 11.6” HD Display','Efficient Intel Celeron N4020 Processor (4M Cache, up to 2.8 GHz)\n11.6” HD (1366 x 768) Slim Display\n64GB eMMC Flash Storage and 4GB DDR4 RAM\nWindows 10 in S Mode with One Year of Microsoft 365 Personal\nSlim and Portable: 0.7” thin and weighs only 2.2 lbs (battery included',50,'ASUS','405','2022-02-07 03:11:33','productimg_1644174724920.jpg'),(87,'SAMSUNG 970 EVO Plus SSD 2TB - M.2 NVMe','INNOVATIVE V NAND TECHNOLOGY: Powered by Samsung V NAND Technology, the 970 EVO Plus SSD\'s NVMe interface (PCIe Gen 3.0 x4 NVMe 1.3) offers enhanced bandwidth, low latency, and power efficiency ideal for tech enthusiasts, high end gamers, and 4K & 3D content designers',51,'Samsung','300','2022-02-07 03:15:12','productimg_1644174936420.jpg'),(88,'SAMSUNG T7 Portable SSD 1TB ','TRANSFER IN A FLASH: Transfers files nearly 9.5x faster than external hard disk drive (HDD). Reads up to 1,050 MB/s / Writes up to 1,000 MB/s on USB 3.2 gen 2 supported devices*.',51,'Samsung','156','2022-02-07 03:16:38','productimg_1644175019381.jpg'),(89,'2020 ASUS VivoBook 15 15.6 Inch','15. 6 inch FHD(1920 x 1080) with four-sided wider NanoEdge bezel display, AMD Radeon Vega 3, AMD Ryzen 3 3200U Processor (2. 6 GHz base frequency up to 3. 5 GHz, 2 Cores, 1MB Cache)',50,'ASUS','860','2022-02-07 03:38:35','productimg_1644176401475.jpg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion`
--

DROP TABLE IF EXISTS `promotion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion` (
  `promoid` int NOT NULL AUTO_INCREMENT,
  `promostart` datetime NOT NULL,
  `promoend` datetime NOT NULL,
  `productid` int NOT NULL,
  `discount` varchar(45) NOT NULL,
  PRIMARY KEY (`promoid`),
  KEY `fk_productid_idx` (`productid`),
  CONSTRAINT `fk_productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion`
--

LOCK TABLES `promotion` WRITE;
/*!40000 ALTER TABLE `promotion` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `productid` int NOT NULL,
  `userid` int NOT NULL,
  `rating` varchar(45) NOT NULL,
  `review` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  UNIQUE KEY `user_product` (`productid`,`userid`) /*!80000 INVISIBLE */,
  KEY `fk_user_id_idx` (`userid`) /*!80000 INVISIBLE */,
  KEY `fk_product_id_idx` (`productid`),
  CONSTRAINT `fk_product_id` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_user_id` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (37,60,61,'5','very good gpu','2022-02-04 23:34:17'),(38,60,62,'4','great gpu but not worth it if you are not a power user','2022-02-04 23:35:07'),(40,67,61,'1','bad cpu. stock cooler is glorified e-waste','2022-02-05 13:36:42'),(41,62,61,'5','amazing','2022-02-06 23:11:53'),(46,75,61,'4','good cpu','2022-02-07 02:52:43'),(47,64,61,'4','very good can play game very fast','2022-02-07 02:55:54'),(48,88,61,'5','very useful ','2022-02-07 03:20:40');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `profile_pic_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`),
  UNIQUE KEY `contact_UNIQUE` (`contact`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (46,'Terry Tan','terry@gmail.com','94582341','abc123456','Customer','https://www.abc.com/terry.jpg','2022-01-03 03:52:52'),(50,'DanMan','dan@gmail.com','91234567','asdf234','Customer','','2022-01-03 03:55:51'),(51,'John','john@gmail.com','91112321','aasda11231','Admin','https://www.pix.com/johnz.jpg','2022-01-03 03:57:47'),(52,'Bob','bobby@gmail.com','81121454','bob123456789','Admin','https://www.profile.com/bobby.png','2022-01-03 03:58:34'),(53,'Luke','lukeee@gmail.com','81235643','abdds1233565','Customer','','2022-01-03 04:00:03'),(55,'William','william@gmail.com','85553423','abdds1233565','Customer','https://www.abc.com/william.jpg','2022-01-03 06:34:18'),(59,'william what what','williammmm@gmail.com','95553423','abdds1233565','Customer','https://www.abc.com/william.jpg','2022-01-05 12:29:25'),(60,'jiakn','jiakn@mail.com','99999999','ji123','Admin',NULL,'2022-01-16 14:25:43'),(61,'user','use@mail.com','88888888','123','Admin',NULL,'2022-01-18 11:00:46'),(62,'hacker','hec@mail.com','00000000','123','Customer',NULL,'2022-01-25 22:23:55');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinterest`
--

DROP TABLE IF EXISTS `userinterest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinterest` (
  `interestid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `categoryid` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`interestid`),
  UNIQUE KEY `user_category` (`userid`,`categoryid`),
  KEY `fk_user_id_idx` (`userid`) /*!80000 INVISIBLE */,
  KEY `fk_cat_id_idx` (`categoryid`),
  CONSTRAINT `fk_category_id` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usr_id` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinterest`
--

LOCK TABLES `userinterest` WRITE;
/*!40000 ALTER TABLE `userinterest` DISABLE KEYS */;
INSERT INTO `userinterest` VALUES (210,61,46,'2022-02-04 15:39:43'),(211,61,47,'2022-02-06 22:07:13'),(212,61,48,'2022-02-06 23:10:17'),(213,62,47,'2022-02-06 23:10:53'),(214,61,50,'2022-02-07 03:14:33');
/*!40000 ALTER TABLE `userinterest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-07  3:58:39
