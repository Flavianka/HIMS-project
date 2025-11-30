-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 30, 2025 at 09:54 AM
-- Server version: 12.0.2-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hypernest`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `remember_token` varchar(255) DEFAULT NULL,
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `two_factor_backup_codes` text DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `first_name`, `last_name`, `username`, `email`, `phone`, `password`, `photo`, `created_at`, `remember_token`, `two_factor_secret`, `two_factor_backup_codes`, `two_factor_enabled`, `two_factor_verified`) VALUES
(4, 'Flavian', 'Kathurima', 'flaviank', 'flaviankathurima@gmail.com', '0705964700', '$2y$10$9jjx09AIusq4QvFJqVvZPOjbbOn6g/mMsMT04CKdFC.B3nG2QDmCe', 'admin_68da4b1d1d88d7.66990145.jpg', '2025-09-29 09:02:21', NULL, 'LHQ2DLNPVA7EWOJ2', '[\"$2y$10$7vfSYfMu8YXioH8dCZOHQuZJWjYkL3l3UWcym\\/DgqV4nSALW5Yab2\",\"$2y$10$9HiYsbTGEeNY1\\/vOc7y0JuOORwZ\\/RCRjtSl.IN0YHcqiAp78S1V6i\",\"$2y$10$2QEB722ZCR49iwr0YeWwve.qMIKbp76q6PigXiOBPO6yEZZyIVTQK\",\"$2y$10$ajuafMM74GvTqXSS.Y3JXOIBlAzqqmLzL8rfuN9y\\/m\\/7xv4bEft8u\",\"$2y$10$J3jZEV06rCEUxyNZmAkGeuIZ6Jne7GYLoixs6Q268sjpvwyrAY4c2\",\"$2y$10$iiaBFOlM6bijcMNG6b7xW.0Y4EbFe85xU2caizPKwyMKJiWNjO\\/DG\",\"$2y$10$g1mDZR7IPBrBBKIYXornO.dmmig2mzVimfDg7ISDlfbXQsYO4o9kG\",\"$2y$10$732lpmLkNjM9370NyT0nduPFGUV57NHwT4hVZeg6pxMqV7XzqzzkO\"]', 1, 1),
(5, 'Joe', 'Doe', 'JD', 'JoeDoe@gmail.com', '0712345678', '$2y$10$VfdANdU5umbBkIDZEi.n5.i8iEnmKJpDK7sAW/amJBtTJkN89PzhK', 'admin_68da52a6251b18.84819038.jpg', '2025-09-29 09:34:30', NULL, NULL, NULL, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `item_code` varchar(10) DEFAULT NULL,
  `low_stock_threshold` int(11) NOT NULL DEFAULT 10,
  `price` decimal(10,2) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `name`, `category`, `stock`, `item_code`, `low_stock_threshold`, `price`, `created_at`, `updated_at`, `image`) VALUES
(2, 'Hammer', 'tools', 0, 'T001', 10, 300.00, '2025-10-07 09:05:26', '2025-10-15 10:41:25', 'inv_68e4d7d663aca5.47328805.jpg'),
(3, 'Screwdriver', 'tools', 16, 'T002', 10, 200.00, '2025-10-07 11:08:51', '2025-10-15 11:11:26', 'inv_68e4f4c32b4a11.75221151.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `mpesa_transactions`
--

CREATE TABLE `mpesa_transactions` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `checkout_request_id` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `result_code` int(11) DEFAULT NULL,
  `result_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `recent_activity`
--

CREATE TABLE `recent_activity` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` enum('admin','user','inventory','order') NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recent_activity`
--

INSERT INTO `recent_activity` (`id`, `description`, `type`, `admin_id`, `created_at`) VALUES
(1, 'New admin registered: Joe Doe', 'admin', NULL, '2025-09-29 09:34:30'),
(2, 'New inventory item added: Hammer', 'inventory', NULL, '2025-10-07 08:54:54'),
(3, 'New inventory item added: Hammer', 'inventory', NULL, '2025-10-07 09:05:26'),
(4, 'Inventory item updated: Hamme', 'inventory', NULL, '2025-10-07 09:20:11'),
(5, 'Inventory item updated: Hammer', 'inventory', NULL, '2025-10-07 09:20:34'),
(6, 'New inventory item added: Screwdriver', 'inventory', NULL, '2025-10-07 11:08:51');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','mpesa','card') NOT NULL,
  `cash_received` decimal(10,2) DEFAULT 0.00,
  `mpesa_phone` varchar(20) DEFAULT NULL,
  `card_number` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `payment_status` enum('pending','completed','failed') DEFAULT 'completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `user_id`, `total_amount`, `payment_method`, `cash_received`, `mpesa_phone`, `card_number`, `created_at`, `payment_status`) VALUES
(1, 1, 500.00, 'cash', 1000.00, '', '', '2025-10-08 10:56:41', 'completed'),
(2, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-14 08:14:00', 'pending'),
(3, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-14 08:14:23', 'pending'),
(4, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-14 08:18:56', 'pending'),
(5, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-14 08:21:16', 'pending'),
(6, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:05:58', 'failed'),
(7, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:11:18', 'pending'),
(8, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:18:04', 'failed'),
(9, 1, 300.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:41:25', 'failed'),
(10, 1, 200.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:54:20', 'failed'),
(11, 1, 200.00, 'mpesa', 0.00, '0705964700', '', '2025-10-15 10:55:35', 'failed'),
(12, 1, 200.00, 'mpesa', 0.00, '254705964700', '', '2025-10-15 11:11:26', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `sale_items`
--

CREATE TABLE `sale_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` decimal(10,2) DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Dumping data for table `sale_items`
--

INSERT INTO `sale_items` (`id`, `sale_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `created_at`) VALUES
(1, 1, 2, 1.00, 300.00, 300.00, '2025-10-08 10:56:41'),
(2, 1, 3, 1.00, 200.00, 200.00, '2025-10-08 10:56:41'),
(3, 2, 2, 1.00, 300.00, 300.00, '2025-10-14 08:14:00'),
(4, 3, 2, 1.00, 300.00, 300.00, '2025-10-14 08:14:23'),
(5, 4, 2, 1.00, 300.00, 300.00, '2025-10-14 08:18:56'),
(6, 5, 2, 1.00, 300.00, 300.00, '2025-10-14 08:21:16'),
(7, 6, 2, 1.00, 300.00, 300.00, '2025-10-15 10:05:58'),
(8, 7, 2, 1.00, 300.00, 300.00, '2025-10-15 10:11:18'),
(9, 8, 2, 1.00, 300.00, 300.00, '2025-10-15 10:18:04'),
(10, 9, 2, 1.00, 300.00, 300.00, '2025-10-15 10:41:25'),
(11, 10, 3, 1.00, 200.00, 200.00, '2025-10-15 10:54:20'),
(12, 11, 3, 1.00, 200.00, 200.00, '2025-10-15 10:55:35'),
(13, 12, 3, 1.00, 200.00, 200.00, '2025-10-15 11:11:26');

-- --------------------------------------------------------

--
-- Table structure for table `super_admins`
--

CREATE TABLE `super_admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `support_requests`
--

CREATE TABLE `support_requests` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `status` enum('pending','resolved','in_progress') DEFAULT 'pending',
  `admin_notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `support_requests`
--

INSERT INTO `support_requests` (`id`, `user_id`, `subject`, `message`, `priority`, `status`, `admin_notes`, `created_at`, `updated_at`) VALUES
(1, 1, 'technical', 'mpesa functionality is non-operational', 'urgent', 'resolved', 'The API is now installed.', '2025-10-14 07:09:57', '2025-10-21 09:11:37');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `photo` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `two_factor_secret` varchar(255) DEFAULT NULL,
  `two_factor_backup_codes` text DEFAULT NULL,
  `two_factor_enabled` tinyint(1) DEFAULT 0,
  `two_factor_verified` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `phone`, `password`, `photo`, `created_at`, `updated_at`, `two_factor_secret`, `two_factor_backup_codes`, `two_factor_enabled`, `two_factor_verified`) VALUES
(1, 'flaviank', 'flaviankathurima@gmail.com', '+254705964700', '$2y$10$DdyggcOBV7Syp5rQSs42VuRJmsCLgpn4ZrdhBtcUEIB60qPVo.zY6', 'user_68da2c313ffc23.75317940.jpg', '2025-09-29 06:50:25', '2025-10-24 09:31:48', '5SIMZNOKLXKNZY7O', '[\"$2y$10$Xm0TVjHVRCajI44pnnOXUeaZYSg.wgWhmKCkYXMeFcwjbg4EPZaQ6\",\"$2y$10$wni\\/gj99RcevAZAZkDrvbu2A1bUZYBGA\\/ExV9ovq6JO6QWG5KmTZ.\",\"$2y$10$\\/QWbi1LzAaowSSG0\\/7v4\\/uessUga48KBrx9nSn\\/\\/AkVMTMbCAK3JO\",\"$2y$10$98JP0EVVsrbdcMNBz4NgyuK3sGtZjhS2Kx4u3pJaSBARLPyP5B33y\",\"$2y$10$NMHiDRdO\\/3Y2n5IVAHdNYOgFAe35fF9KQfogeMf1NNWqq0iRgM9.q\",\"$2y$10$8zh\\/Bnt8JDOyDjkYijqtYeUvfx9KgXxjWk6NTPc75tEHGjGQrP9Gi\",\"$2y$10$ijkfHDtLJwvzPLPatELBy.k9l4CmLXpkNqNtkHAZHOH.5EDNWbskS\",\"$2y$10$KLmn5uETn4dGcfNmSE0OIevhYXU5w18GKtnHNfl7ff8ZnRda7LZ7K\"]', 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_code` (`item_code`);

--
-- Indexes for table `mpesa_transactions`
--
ALTER TABLE `mpesa_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `checkout_request_id` (`checkout_request_id`),
  ADD KEY `sale_id` (`sale_id`);

--
-- Indexes for table `recent_activity`
--
ALTER TABLE `recent_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_recent_activity_admin` (`admin_id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `super_admins`
--
ALTER TABLE `super_admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indexes for table `support_requests`
--
ALTER TABLE `support_requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `mpesa_transactions`
--
ALTER TABLE `mpesa_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `recent_activity`
--
ALTER TABLE `recent_activity`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `sale_items`
--
ALTER TABLE `sale_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `super_admins`
--
ALTER TABLE `super_admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `support_requests`
--
ALTER TABLE `support_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `mpesa_transactions`
--
ALTER TABLE `mpesa_transactions`
  ADD CONSTRAINT `mpesa_transactions_ibfk_1` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recent_activity`
--
ALTER TABLE `recent_activity`
  ADD CONSTRAINT `fk_recent_activity_admin` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sale_items`
--
ALTER TABLE `sale_items`
  ADD CONSTRAINT `sale_items_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `inventory` (`id`);

--
-- Constraints for table `support_requests`
--
ALTER TABLE `support_requests`
  ADD CONSTRAINT `support_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
