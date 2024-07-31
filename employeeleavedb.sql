-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2024 at 06:25 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `employeeleavedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `leaverequests`
--

CREATE TABLE `leaverequests` (
  `requestID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `leaveType` varchar(50) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  `reason` text NOT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `leaverequests`
--

INSERT INTO `leaverequests` (`requestID`, `userID`, `leaveType`, `startDate`, `endDate`, `reason`, `status`) VALUES
(1, 2, 'Sick Leave', '2024-12-17', '2024-12-19', '', 'approved'),
(2, 4, 'Other', '2024-12-17', '2024-12-28', 'covid positive', 'approved'),
(3, 4, 'Other', '2024-12-17', '2024-12-28', 'covid positive', 'approved');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('employee','manager') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `name`, `email`, `password`, `role`) VALUES
(1, 'Manager1', 'manager1@example.com', '$2a$10$4B4haV/QIdl8m31Dnv5eheTMOni7etvibs.OmLQQYM7SXVyhk6Jwm', 'manager'),
(2, 'Employee1', 'employee1@example.com', '$2a$10$3s0CNG1RMIvektUXPfGn.eZnlb1V6K4lfQWhM4FhMKh7qtq8pjVhe', 'employee'),
(3, 'Employee2', 'employee2@example.com', '$2a$10$LVL3ld1uuaVJKwfwcmRlIuXqzStKDmfiR7QwtBFEIqlTyCB33XvSO', 'employee'),
(4, 'Abin Kakkallil Sebastian', 'Abin@example.com', '$2a$10$iJ7YjgQS9Ih9apqxn9tlEOVyD9Oy1onR243eh1/Ifv6HUZI/wj0dS', 'employee');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `leaverequests`
--
ALTER TABLE `leaverequests`
  ADD PRIMARY KEY (`requestID`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `leaverequests`
--
ALTER TABLE `leaverequests`
  MODIFY `requestID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `leaverequests`
--
ALTER TABLE `leaverequests`
  ADD CONSTRAINT `leaverequests_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`userID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
