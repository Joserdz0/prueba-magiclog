-- --------------------------------------------------------
-- Host:                         108.179.194.68
-- Server version:               5.7.23-23 - Percona Server (GPL), Release 23, Revision 500fcf5
-- Server OS:                    Linux
-- HeidiSQL Version:             12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for codimets_pruebas
DROP DATABASE IF EXISTS `codimets_pruebas`;
CREATE DATABASE IF NOT EXISTS `codimets_pruebas` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */;
USE `codimets_pruebas`;

-- Dumping structure for table codimets_pruebas.cart_items
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table codimets_pruebas.cart_items: ~1 rows (approximately)
INSERT INTO `cart_items` (`id`, `user_id`, `product_id`, `quantity`, `added_at`) VALUES
	(5, 2, 1, 4, '2025-06-20 19:49:43'),
	(6, 2, 2, 10, '2025-06-20 19:52:18');

-- Dumping structure for table codimets_pruebas.products
DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `sku` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `seller_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table codimets_pruebas.products: ~5 rows (approximately)
INSERT INTO `products` (`id`, `name`, `sku`, `quantity`, `price`, `seller_id`, `created_at`) VALUES
	(1, 'Mouse Gamer', 'MG123', 15, 499.99, 1, '2025-06-20 11:27:23'),
	(2, 'Silla Gamer', '123434', 13, 10.00, 2, '2025-06-20 16:32:00'),
	(3, 'Mesa', '13', 1, 1.00, 2, '2025-06-20 16:34:21'),
	(6, 'Mouse Gamer 2', 'MG1233', 15, 499.99, 1, '2025-06-20 17:10:05'),
	(8, 'Mouse Gamer 4', 'MG12334', 15, 499.99, 4, '2025-06-20 17:11:15'),
	(9, 'Lapices', '1asf3', 1, 234.00, 2, '2025-06-20 17:16:44'),
	(10, 'labubu', 'lab-1234', 1, 1.00, 2, '2025-06-20 21:02:21');

-- Dumping structure for table codimets_pruebas.tokens
DROP TABLE IF EXISTS `tokens`;
CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `token` text COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table codimets_pruebas.tokens: ~0 rows (approximately)

-- Dumping structure for table codimets_pruebas.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `role` enum('SELLER','BUYER','ADMIN') COLLATE utf8_unicode_ci DEFAULT 'BUYER',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- Dumping data for table codimets_pruebas.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `created_at`) VALUES
	(1, 'test@mail.com', '$2b$10$Od2dJrjtGehPI.E4s4HRZO4B1poihb6pGRB7a8j0tQi0jDjs/6zR2', 'SELLER', '2025-06-20 10:50:16'),
	(2, 'admin@gmail.com', '$2b$10$O8XwJbnRRuDif2ZligkM/e.GRQow8WRTLUEEVEP9x2VUWHfB1iNOm', 'ADMIN', '2025-06-20 11:24:13'),
	(3, 'prueba@gmail.com', '$2b$10$abiDZKwbHmnT8XlWyS8lyeVz6Qwt6RymrpLKmnRtBCJdoGjf0VTlm', 'SELLER', '2025-06-20 13:24:30'),
	(4, 'admin2@gmail.com', '$2b$10$buJAQkyVjiYiwxFEqq7h6.UirOrHuTZelWx3A.Wlp5YM4krG/mzn6', 'SELLER', '2025-06-20 17:06:34'),
	(5, 'prueba2@gmail.com', '$2b$10$JjHxghIYGkzakrcShZga6O0G231XiEzseX5SWnSM.m1//u2xcksBu', 'SELLER', '2025-06-20 18:14:26');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
