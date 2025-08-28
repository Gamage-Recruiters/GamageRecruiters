CREATE DATABASE IF NOT EXISTS gamage_db;
USE gamage_db;


-- MySQL dump 10.13  Distrib 8.0.42, for macos15 (arm64)
--
-- Host: localhost    Database: gamage_db
-- ------------------------------------------------------
-- Server version	8.4.5

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
-- Table structure for table `activitylogs`
--

DROP TABLE IF EXISTS `activitylogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activitylogs` (
  `activityId` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `activity` varchar(256) NOT NULL,
  `completedAt` datetime NOT NULL,
  PRIMARY KEY (`activityId`),
  KEY `userfk_idx` (`userId`),
  CONSTRAINT `userfk` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylogs`
--

LOCK TABLES `activitylogs` WRITE;
/*!40000 ALTER TABLE `activitylogs` DISABLE KEYS */;
INSERT INTO `activitylogs` VALUES (7,78,'Updated User Image','2025-06-13 15:13:29'),(8,78,'Updated User Image','2025-06-13 15:15:14'),(9,78,'Changed User Password From Password123! to Password123','2025-06-13 15:18:49'),(10,78,'Updated User Data','2025-06-13 15:21:23'),(17,78,'Updated User Image','2025-07-03 10:09:38'),(18,78,'Updated User Image','2025-07-03 10:10:31'),(19,78,'Updated User CV','2025-07-03 10:16:39'),(20,78,'Updated User CV','2025-07-03 10:18:08'),(21,78,'Updated User CV','2025-07-03 10:18:29'),(22,78,'Updated User CV','2025-07-03 10:18:47'),(23,78,'Updated User CV','2025-07-08 11:54:38'),(24,78,'Updated User Data','2025-07-08 11:57:08');
/*!40000 ALTER TABLE `activitylogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `adminId` int NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) NOT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `gender` varchar(45) DEFAULT NULL,
  `role` varchar(45) DEFAULT NULL,
  `primaryPhoneNumber` varchar(20) DEFAULT NULL,
  `secondaryPhoneNumber` varchar(20) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `image` mediumtext,
  PRIMARY KEY (`adminId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (8,'John Doeeeee','john.doe@example.com','$2b$10$lR4YEC4dn20bigd726pHp.TdUka140..HtZprA9CB6nM3d/mvzVzi','2025-06-01 15:39:03','Male','Manager','1234567899','123456789','Active','1753432138007-ChatGPT Image Jul 9, 2025, 03_02_56 PM (1) copy.png'),(13,'Damsiha Admin','damsi@123.com','$2b$10$U4YKkehz7sEF0MNL8ky0Te..DFW6McZRE2phvNi.ls3OOysH9AnA.','2025-07-08 11:32:38','Female','Super Admin','12345678','23456789','Active',NULL);
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sessions`
--

DROP TABLE IF EXISTS `admin_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_sessions` (
  `SessionId` int NOT NULL AUTO_INCREMENT,
  `Id` int NOT NULL,
  `token` varchar(256) NOT NULL,
  `createdAt` datetime NOT NULL,
  `status` varchar(20) NOT NULL,
  `role` varchar(20) NOT NULL,
  PRIMARY KEY (`SessionId`),
  KEY `Id` (`Id`),
  CONSTRAINT `admin_sessions_ibfk_1` FOREIGN KEY (`Id`) REFERENCES `admin` (`adminId`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sessions`
--

LOCK TABLES `admin_sessions` WRITE;
/*!40000 ALTER TABLE `admin_sessions` DISABLE KEYS */;
INSERT INTO `admin_sessions` VALUES (7,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI0NjQ1LCJpYXQiOjE3NDkyMjEwNDV9.62_RCcBivGlHBXPk0-0pNWpJeCWNkeL5A1K6rhT9Wmw','2025-06-06 20:14:05','Active','Admin'),(8,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI0NzQ1LCJpYXQiOjE3NDkyMjExNDV9.i2hf5tUneZPifuXbpCp5yJQ8dyzfvhT6YDz9Yr_MPtA','2025-06-06 20:15:45','Active','Admin'),(9,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI2MDIxLCJpYXQiOjE3NDkyMjI0MjF9.RXQnR-qTF_DV4wtDPXRJoKXIV0KVIaexHhygq2Nv84Q','2025-06-06 20:37:02','Active','Admin'),(10,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI2NTIwLCJpYXQiOjE3NDkyMjI5MjB9.SvFP8BkW9uOb5TM3s4Jmu7bHSqlax_GFNUivx4V3Sgw','2025-06-06 20:45:20','Active','Admin'),(11,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI3MDkwLCJpYXQiOjE3NDkyMjM0OTB9.VeleXzyKxwlPxzbESoRk8E5Zb8E58L1_OskQ7MjEoC4','2025-06-06 20:54:51','Active','Admin'),(12,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI4OTg0LCJpYXQiOjE3NDkyMjUzODR9.0iQ-7VtYE6tasG18LNsewq2mM6nU1FkcrrZ8TVviL4A','2025-06-06 21:26:25','Active','Admin'),(13,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI5NDMzLCJpYXQiOjE3NDkyMjU4MzN9.ZH7uKgUBQSO2ZYb8IzLr3XIzhXocNdy9Mq8HPHgY7T4','2025-06-06 21:33:54','Active','Admin'),(14,8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZXhwIjoxNzQ5MjI5OTA0LCJpYXQiOjE3NDkyMjYzMDR9.GFzE942noOf3KJlMSVI7IIlQHWLLWGqitLUjEIpKMPU','2025-06-06 21:41:45','Active','Admin');
/*!40000 ALTER TABLE `admin_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogcomments`
--

DROP TABLE IF EXISTS `blogcomments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogcomments` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `blogId` int NOT NULL,
  `comment` mediumtext NOT NULL,
  `commentedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `user_idx` (`userId`),
  KEY `blog_idx` (`blogId`),
  CONSTRAINT `fk_blog` FOREIGN KEY (`blogId`) REFERENCES `blogs` (`blogId`),
  CONSTRAINT `fk_user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogcomments`
--

LOCK TABLES `blogcomments` WRITE;
/*!40000 ALTER TABLE `blogcomments` DISABLE KEYS */;
INSERT INTO `blogcomments` VALUES (25,78,19,'hi ','2025-07-14 17:10:32');
/*!40000 ALTER TABLE `blogcomments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bloglikes`
--

DROP TABLE IF EXISTS `bloglikes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bloglikes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `blogId` int NOT NULL,
  `userId` int NOT NULL,
  `liked` tinyint(1) DEFAULT NULL,
  `likedDate` datetime DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `blogId_idx` (`blogId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `blog` FOREIGN KEY (`blogId`) REFERENCES `blogs` (`blogId`),
  CONSTRAINT `user` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bloglikes`
--

LOCK TABLES `bloglikes` WRITE;
/*!40000 ALTER TABLE `bloglikes` DISABLE KEYS */;
/*!40000 ALTER TABLE `bloglikes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `blogId` int NOT NULL AUTO_INCREMENT,
  `title` mediumtext NOT NULL,
  `introduction` longtext,
  `subTitle1` varchar(256) DEFAULT NULL,
  `subContent1` longtext,
  `subTitle2` varchar(256) DEFAULT NULL,
  `subContent2` longtext,
  `subTitle3` varchar(256) DEFAULT NULL,
  `subContent3` longtext,
  `subTitle4` varchar(256) DEFAULT NULL,
  `subContent4` longtext,
  `subTitle5` varchar(256) DEFAULT NULL,
  `subContent5` longtext,
  `subTitle6` varchar(256) DEFAULT NULL,
  `subContent6` longtext,
  `blogImage` varchar(100) DEFAULT NULL,
  `subTitle7` varchar(256) DEFAULT NULL,
  `subContent7` longtext,
  `subTitle8` varchar(256) DEFAULT NULL,
  `subContent8` longtext,
  `subTitle9` varchar(256) DEFAULT NULL,
  `subContent9` longtext,
  `subTitle10` varchar(256) DEFAULT NULL,
  `subContent10` longtext,
  `tags` mediumtext,
  `author` varchar(256) DEFAULT NULL,
  `authorPosition` varchar(256) DEFAULT NULL,
  `authorCompany` varchar(256) DEFAULT NULL,
  `Quote1` mediumtext,
  `Quote2` mediumtext,
  `Quote3` mediumtext,
  `addedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `category` varchar(100) DEFAULT NULL,
  `coverImage` varchar(100) DEFAULT NULL,
  `authorImage` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`blogId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES (18,'test1','hi','','','','','','','','','','','','','1753350038358-WhatsApp Image 2025-06-16 at 15.16.06.jpeg','','','','','','','','','','doggy','yo','yo','','','','2025-07-24 15:10:38','Industry Trends','1753349903560-1741961590689.jpeg','1753349883977-00a99c.png'),(19,'yo','hi','hi','hi content','','','','','','','','','','','1753343190071-ChatGPT Image Jul 9, 2025, 03_02_56 PM.png','','','','','','','','','','hjhjhjlk','ceo','abc','yo','','','2025-07-24 15:07:19','Industry Trends','1753343175193-ChatGPT Image Jul 9, 2025, 03_02_56 PM.png','1753349838964-ChatGPT Image Jul 9, 2025, 03_02_56 PM (1) copy.png');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacttable`
--

DROP TABLE IF EXISTS `contacttable`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacttable` (
  `id` int NOT NULL AUTO_INCREMENT,
  `phoneNumber` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `subject` varchar(1000) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacttable`
--

LOCK TABLES `contacttable` WRITE;
/*!40000 ALTER TABLE `contacttable` DISABLE KEYS */;
INSERT INTO `contacttable` VALUES (4,'0760085969','damsihak2@gmail.com','Damsiha Kumarasinghe','test 1','hi I\'m damsiha','2025-06-16 05:43:08');
/*!40000 ALTER TABLE `contacttable` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobapplications`
--

DROP TABLE IF EXISTS `jobapplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobapplications` (
  `applicationId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phoneNumber` varchar(20) NOT NULL,
  `resume` varchar(100) NOT NULL,
  `appliedDate` datetime NOT NULL,
  `jobId` int NOT NULL,
  `userId` int NOT NULL,
  PRIMARY KEY (`applicationId`),
  UNIQUE KEY `user_job_unique` (`userId`,`jobId`),
  KEY `jobId_idx` (`jobId`),
  KEY `userId_idx` (`userId`),
  CONSTRAINT `jobId` FOREIGN KEY (`jobId`) REFERENCES `jobs` (`jobId`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobapplications`
--

LOCK TABLES `jobapplications` WRITE;
/*!40000 ALTER TABLE `jobapplications` DISABLE KEYS */;
INSERT INTO `jobapplications` VALUES (85,'John','Cena','damsihak@gmail.com','076 1234567','1753265267961-test.pdf','2025-07-23 15:37:48',10,78);
/*!40000 ALTER TABLE `jobapplications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `jobId` int NOT NULL AUTO_INCREMENT,
  `jobName` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `jobLocation` varchar(100) NOT NULL,
  `jobType` varchar(100) NOT NULL,
  `salaryRange` varchar(100) NOT NULL,
  `postedDate` datetime NOT NULL,
  `jobDescription` longtext NOT NULL,
  `responsibilities` longtext NOT NULL,
  `requirements` longtext NOT NULL,
  `benefits` longtext NOT NULL,
  `companyDescription` longtext,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  PRIMARY KEY (`jobId`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (10,'Backend Developerr','Gamage Recruiterss','Colomboop','Internship','non paid','2025-07-14 16:07:55','8-5 working hours','[\"Develop the backend\",\"manage the db\"]','[\"5 year experience\",\"10 year degree\"]','[\"Recommendation Letter\"]','Most reputed recruiting firm','Active'),(19,'Frontend Developer','Gamage Recruiterss','Remote','Full-time','150,000','2025-07-21 11:40:04','develop the frontend','[\"develop frontend\"]','[\"a degree\"]','[\"a conmensation\"]','gamge rec','Active'),(20,'Backend Developer2','Gamage Recruiters2','New York','Part-time','160,000','2025-07-21 11:39:56','','[]','[]','[]','','Active'),(21,'Quality Assurance Intern','Damsi Tech','Remote','Full-time','150,000','2025-07-22 08:42:33','','[]','[]','[]','','Active');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `loginsthroughplatforms`
--

DROP TABLE IF EXISTS `loginsthroughplatforms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginsthroughplatforms` (
  `loginId` int NOT NULL AUTO_INCREMENT,
  `accountId` varchar(256) DEFAULT NULL,
  `photo` varchar(500) DEFAULT NULL,
  `name` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `loggedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `loggedOutAt` datetime DEFAULT NULL,
  `platform` varchar(20) NOT NULL,
  PRIMARY KEY (`loginId`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `loginsthroughplatforms`
--

LOCK TABLES `loginsthroughplatforms` WRITE;
/*!40000 ALTER TABLE `loginsthroughplatforms` DISABLE KEYS */;
INSERT INTO `loginsthroughplatforms` VALUES (1,'110172415484367856279','https://lh3.googleusercontent.com/a/ACg8ocLioQBCi7mIp95yg8fXerejHNK625InKLDhL7tAuyZrAY0KA2Y=s96-c','Suchith Sandunika Epa','esuchith@gmail.com','2025-03-26 07:31:59',NULL,'Google'),(2,'1461400055244664','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1461400055244664&height=50&width=50&ext=1745547066&hash=AbZpHlDO72_UlXJqPoyz-QEX','Suchith Sandunika Epa','esuchith@gmail.com','2025-03-26 07:41:06',NULL,'Facebook'),(3,'1461400055244664','https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1461400055244664&height=50&width=50&ext=1745729690&hash=AbZ9Rc0rjz0HOcPfo-uNiEGf','Suchith Sandunika Epa','esuchith@gmail.com','2025-03-28 10:24:56',NULL,'Facebook'),(4,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-03-28 12:07:18',NULL,'Google'),(5,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-03-28 12:15:31',NULL,'Google'),(6,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-03-28 12:31:28',NULL,'Google'),(7,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-03-28 14:43:17',NULL,'Google'),(8,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-03-28 16:53:43',NULL,'Google'),(9,'110172415484367856279','https://lh3.googleusercontent.com/a/ACg8ocLioQBCi7mIp95yg8fXerejHNK625InKLDhL7tAuyZrAY0KA2Y=s96-c','Suchith Sandunika Epa','esuchith@gmail.com','2025-03-31 15:55:46',NULL,'Google'),(10,'110172415484367856279','https://lh3.googleusercontent.com/a/ACg8ocLioQBCi7mIp95yg8fXerejHNK625InKLDhL7tAuyZrAY0KA2Y=s96-c','Suchith Sandunika Epa','esuchith@gmail.com','2025-04-03 13:42:05',NULL,'Google'),(11,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 13:46:48',NULL,'Google'),(12,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 13:53:00',NULL,'Google'),(13,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 13:57:52',NULL,'Google'),(14,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 14:00:40',NULL,'Google'),(15,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 14:03:12',NULL,'Google'),(16,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 14:05:31',NULL,'Google'),(17,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 14:10:21',NULL,'Google'),(18,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 14:20:22',NULL,'Google'),(19,'101209874541912465042','https://lh3.googleusercontent.com/a/ACg8ocIfgRY2Lb2mFPs8J5snsmA4A7YQ4T0W8-Bate2drXAuyCzESTE=s96-c','SSe Lion.s','sselions2000@gmail.com','2025-04-03 14:26:09',NULL,'Google'),(20,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 20:01:08',NULL,'Google'),(21,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 20:08:17',NULL,'Google'),(22,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 20:16:31',NULL,'Google'),(23,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 20:20:06',NULL,'Google'),(24,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-03 20:30:26',NULL,'Google'),(25,'101209874541912465042','https://lh3.googleusercontent.com/a/ACg8ocIfgRY2Lb2mFPs8J5snsmA4A7YQ4T0W8-Bate2drXAuyCzESTE=s96-c','SSe Lion.s','sselions2000@gmail.com','2025-04-04 05:28:28',NULL,'Google'),(26,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 05:31:09',NULL,'Google'),(27,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 05:36:03',NULL,'Google'),(28,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 05:43:29',NULL,'Google'),(29,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 05:58:33',NULL,'Google'),(30,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 09:34:04',NULL,'Google'),(31,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 09:37:33',NULL,'Google'),(32,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 12:42:18',NULL,'Google'),(33,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 12:45:38',NULL,'Google'),(34,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-04 18:31:02',NULL,'Google'),(35,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:29:05',NULL,'Google'),(36,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:32:43',NULL,'Google'),(37,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:35:16',NULL,'Google'),(38,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:36:40',NULL,'Google'),(39,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:38:54',NULL,'Google'),(40,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 18:41:47',NULL,'Google'),(41,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 19:35:39',NULL,'Google'),(42,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-06 20:38:09',NULL,'Google'),(43,'101209874541912465042','https://lh3.googleusercontent.com/a/ACg8ocIfgRY2Lb2mFPs8J5snsmA4A7YQ4T0W8-Bate2drXAuyCzESTE=s96-c','SSe Lion.s','sselions2000@gmail.com','2025-04-07 13:52:43',NULL,'Google'),(44,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 09:54:44',NULL,'Google'),(45,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 09:55:29',NULL,'Google'),(46,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 09:58:54',NULL,'Google'),(47,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 10:00:12',NULL,'Google'),(48,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 10:01:21',NULL,'Google'),(49,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 10:01:39',NULL,'Google'),(50,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 10:03:03',NULL,'Google'),(51,'117397795830315274529','https://lh3.googleusercontent.com/a/ACg8ocIYBJYm6s_WJ6RWfGASDaar1KXM1Aetci1I34yYV30UBdeubOA=s96-c','Lion.s SSE','sselions77@gmail.com','2025-04-18 10:05:02',NULL,'Google'),(54,'110172415484367856279','https://lh3.googleusercontent.com/a/ACg8ocLioQBCi7mIp95yg8fXerejHNK625InKLDhL7tAuyZrAY0KA2Y=s96-c','Suchith Sandunika Epa','esuchith@gmail.com','2025-05-16 08:07:50',NULL,'Google'),(55,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-05-28 08:47:19',NULL,'Google'),(56,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-05-30 09:24:20',NULL,'Google'),(57,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-06-02 12:14:33',NULL,'Google'),(58,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-06-02 12:22:07',NULL,'Google'),(59,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-06-02 12:57:16',NULL,'Google'),(60,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-06-02 13:00:07',NULL,'Google'),(61,'105587971082423362561','https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c','Damsiha Kumarasinghe','damsihak2@gmail.com','2025-06-02 13:02:22',NULL,'Google');
/*!40000 ALTER TABLE `loginsthroughplatforms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `sessionId` int NOT NULL AUTO_INCREMENT,
  `Id` int NOT NULL,
  `token` varchar(256) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `endedAt` datetime DEFAULT NULL,
  `status` enum('Active','Ended','Pending') NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`sessionId`),
  KEY `userId` (`Id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`Id`) REFERENCES `users` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `company` varchar(100) NOT NULL,
  `designation` varchar(100) NOT NULL,
  `testimonialText` text NOT NULL,
  `companyLogoPath` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES (1,'Sarah Johnson','TechCorp Inc.','CTO','Working with this recruiting team was exceptional. They understood our technical needs perfectly and matched us with outstanding candidates who hit the ground running.','uploads/testimonials/FELV-cat.jpg'),(2,'Michael Chen','Global Innovations','HR Director','The recruiters at Gamage consistently deliver high-quality candidates. Their thorough screening process saves us valuable time in our hiring workflow.','uploads/testimonials/FELV-cat.jpg'),(3,'Elena Rodriguez','Future Systems','CEO','As a fast-growing startup, finding the right talent quickly was crucial. This team exceeded our expectations by providing candidates who not only had the right skills but also fit our company culture.','uploads/testimonials/FELV-cat.jpg'),(4,'David Thompson','Enterprise Solutions','Engineering Manager','Their technical understanding sets them apart from other recruiters. They actually understand the roles they\'re recruiting for, which makes all the difference.','uploads/testimonials/FELV-cat.jpg');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userId` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(256) NOT NULL,
  `lastName` varchar(256) NOT NULL,
  `gender` enum('Male','Female','Other') DEFAULT NULL,
  `birthDate` date DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `address2` varchar(256) DEFAULT NULL,
  `phoneNumber1` varchar(15) DEFAULT NULL,
  `phoneNumber2` varchar(15) DEFAULT NULL,
  `linkedInLink` varchar(256) DEFAULT NULL,
  `facebookLink` varchar(256) DEFAULT NULL,
  `portfolioLink` varchar(256) DEFAULT NULL,
  `email` varchar(256) NOT NULL,
  `password` varchar(256) DEFAULT NULL,
  `cv` varchar(256) DEFAULT NULL,
  `photo` varchar(256) DEFAULT NULL,
  `profileDescription` longtext,
  `createdAt` datetime NOT NULL,
  `subscribedToNewsLetter` tinyint(1) DEFAULT '0',
  `lastActive` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `googleId` varchar(255) DEFAULT NULL,
  `facebookId` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`userId`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (78,'John','Cena','Male','1990-01-01','391/24, Railway Housing Scheme,','Galle Road','12345678',NULL,'https://damsi.com',NULL,NULL,'damsihak@gmail.com','$2b$10$eFWoK6EHQKMWNGZf.KYWQukgPUJhQsalcA72BDrj.xgybVF8pGZKu','1751955877628-CertificateOfCompletion_Learning C.pdf','1751517630678-FELV-cat.jpg','hellooo','2025-06-12 13:41:06',1,'2025-07-29 11:30:42',NULL,NULL),(105,'Damsiha','Kumarasinghe',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'damsihak2@gmail.com',NULL,NULL,'https://lh3.googleusercontent.com/a/ACg8ocL7R0_7NqARon0QH4aGzygUlwTNK1SEKbEpHQ1RkLiqUp1i=s96-c',NULL,'2025-07-29 11:05:10',0,'2025-07-29 11:25:05','105587971082423362561',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `workshops`
--

DROP TABLE IF EXISTS `workshops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `workshops` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `category` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(50) NOT NULL,
  `location` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `speaker` varchar(255) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `spots` int DEFAULT '0',
  `rating` decimal(3,2) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `description` text,
  `event_type` enum('Past Event','Upcoming Event') DEFAULT 'Upcoming Event',
  `addedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `workshops`
--

LOCK TABLES `workshops` WRITE;
/*!40000 ALTER TABLE `workshops` DISABLE KEYS */;
INSERT INTO `workshops` VALUES (3,'Financial Planning Seminar','Finance','2025-04-25','1:00 PM - 5:00 PM','Grand Hotel, Chicago','https://images.pexels.com/photos/9034869/pexels-photo-9034869.jpeg','from-amber-500 to-orange-600','Sarah Williams, CFA',199.00,0,4.80,NULL,'Plan your financial future with expert guidance on investments, retirement, and wealth building strategies.','Past Event','2025-04-09 08:07:29','2025-04-09 08:07:29'),(4,'Data Science Fundamentals','Technology','2025-05-05','9:00 AM - 5:00 PM','Online (Virtual)','https://images.pexels.com/photos/17485657/pexels-photo-17485657/free-photo-of-an-artist-s-illustration-of-artificial-intelligence-ai-this-image-depicts-how-ai-could-adapt-to-an-infinite-amount-of-uses-it-was-created-by-nidia-dias-as-part-of-the-visualising-ai-pr.png','from-indigo-500 to-blue-600','Dr. Alex Chen',249.00,NULL,4.60,NULL,NULL,'Upcoming Event','2025-04-09 08:08:40','2025-04-09 08:08:40'),(5,'Public Speaking Masterclass','Communication','2025-05-12','10:00 AM - 3:00 PM','Conference Center, Austin','https://images.pexels.com/photos/3761509/pexels-photo-3761509.jpeg','from-red-500 to-pink-600','James Wilson',275.00,8,4.90,NULL,NULL,'Upcoming Event','2025-04-09 08:08:40','2025-04-09 08:08:40'),(7,'Sustainable Business Practicess','Sustainability','2025-06-03','1:00 PM - 5:00 PM','Green Center, Portlandd','https://images.pexels.com/photos/7438102/pexels-photo-7438102.jpeg','from-emerald-500 to-green-600','Dr. Michael Green',199.00,20,4.70,'','','Upcoming Event','2025-04-09 08:08:40','2025-07-14 06:34:54'),(21,'new workshop','Design','2025-07-09','9:00 AM - 4:00 PM','Tech Hub, San Francisco','1751955232508-images (1).jpg','from-green-500 to-teal-600','123',123.00,25,4.50,'https://www.youtube.com/','workshop decription','Upcoming Event','2025-07-08 06:13:52','2025-07-08 06:13:52');
/*!40000 ALTER TABLE `workshops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-29 11:42:46
