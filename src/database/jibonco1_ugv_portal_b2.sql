-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 07, 2026 at 04:41 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jibonco1_ugv_portal_b2`
--

-- --------------------------------------------------------

--
-- Table structure for table `cookies`
--

CREATE TABLE IF NOT EXISTS `cookies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cookie` varchar(1024) DEFAULT NULL,
  `user_id` varchar(1024) DEFAULT NULL,
  `time` varchar(32) DEFAULT '0',
  `ip` varchar(32) DEFAULT '0',
  `user_agent` varchar(1024) DEFAULT '0',
  `status` varchar(32) DEFAULT 'ACTIVE',
  `expiry` varchar(32) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cookies`
--

INSERT IGNORE INTO `cookies` (`id`, `cookie`, `user_id`, `time`, `ip`, `user_agent`, `status`, `expiry`) VALUES
(1, '65da2e217c6ced5ca79ec86450b8f443', '1', '1770398407', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'EXPIRED', '1770398726'),
(2, '6d443aea317949c3cfc666363c48d43f', '1', '1770398791', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772990791'),
(3, 'f306524fd56e3b5cca8d27df2409f1cc', '1', '1770398891', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772990891'),
(4, '861b2f1ba35a8059b4fa61bb42ff22eb', '1', '1770398897', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772990897'),
(5, '2a16b10ad045e49c788b3e7f5090af8d', '1', '1770399026', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772991026'),
(6, '0563cd6491de9b4f5008ebcaa33d72e2', '1', '1770399075', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772991075'),
(7, '437b77a4285fbe64336798c5eb9ce006', '1', '1770399102', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1772991102'),
(8, '24c1a0e957bd75924757a7d6ffada698', '1', '1770399366', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'EXPIRED', '1770399423'),
(9, 'a901a9fa3a285a2912a436ba90f86d7b', '1', '1770399458', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'EXPIRED', '1770405784'),
(10, '8df05ebbd0e987b75673fbe1033a984f', '1', '1770405785', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'EXPIRED', '1770408137'),
(11, '4fdde39568b90377787f3d693eae666a', '1', '1770408139', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'EXPIRED', '1770409572'),
(12, 'b7d1b294faf65db6d621bd2fed6f7b42', '1', '1770409577', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36', 'ACTIVE', '1773027633');

-- --------------------------------------------------------

--
-- Table structure for table `majors`
--

CREATE TABLE IF NOT EXISTS `majors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `degree_type` varchar(64) NOT NULL,
  `program_name` varchar(255) NOT NULL,
  `program_short_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `majors`
--

INSERT IGNORE INTO `majors` (`id`, `degree_type`, `program_name`, `program_short_name`) VALUES
(1, 'B.Sc', 'Computer Science and Engineering', 'CSE');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_year` varchar(4) NOT NULL,
  `session_season` varchar(32) NOT NULL,
  `short_code` varchar(16) NOT NULL,
  `status` varchar(16) DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sessions`
--

INSERT IGNORE INTO `sessions` (`id`, `session_year`, `session_season`, `short_code`, `status`) VALUES
(1, '2026', 'Summer', 'SUM26', 'Completed'),
(2, '2026', 'Winter', 'WIN26', 'ACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `sms_sents`
--

CREATE TABLE IF NOT EXISTS `sms_sents` (
  `id` int(255) NOT NULL AUTO_INCREMENT,
  `phone` varchar(64) NOT NULL DEFAULT '',
  `user_id` varchar(255) NOT NULL,
  `body` longtext NOT NULL,
  `time` varchar(16) NOT NULL DEFAULT '0',
  `charged` varchar(8) NOT NULL DEFAULT '0.50',
  `ip` varchar(1024) NOT NULL,
  `status` varchar(32) NOT NULL,
  `error` longtext NOT NULL,
  `response` longtext NOT NULL,
  `request_id` varchar(255) NOT NULL,
  `sms_server` varchar(1024) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE IF NOT EXISTS `subjects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` varchar(11) NOT NULL,
  `semester` varchar(16) NOT NULL,
  `subject_name` varchar(255) NOT NULL,
  `subject_code` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) NOT NULL,
  `user_type` varchar(32) NOT NULL,
  `email_address` varchar(1024) NOT NULL,
  `phone_number` varchar(16) NOT NULL,
  `faculty_id` varchar(11) NOT NULL,
  `designation` varchar(32) NOT NULL,
  `user_id` varchar(16) NOT NULL,
  `password` varchar(32) NOT NULL,
  `joining_date` varchar(32) NOT NULL,
  `status` varchar(16) NOT NULL DEFAULT 'INACTIVE',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT IGNORE INTO `users` (`id`, `name`, `user_type`, `email_address`, `phone_number`, `faculty_id`, `designation`, `user_id`, `password`, `joining_date`, `status`) VALUES
(1, 'Jibon', 'ADMIN', 'programmerjibon@gmail.com', '01600301810', '', 'System Administrator', '1', '700c8b805a3e2a265b01c77614cd8b21', '19-11-2019', 'ACTIVE'),
(5, 'Zahid Akon', 'Teacher', 'zahid@ugv.edu.bd', '01600112233', '1', 'Lecturer', 'T-1', '716e44ee064be58fc7a02f05a48f4ee9', '2020-01-01', 'ACTIVE'),
(6, 'asf', 'Admission', 'wer@sf.tt', '01222447741', 'N/A', 'Admission', 'AG-1', '716e44ee064be58fc7a02f05a48f4ee9', '2025-11-04', 'ACTIVE');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
