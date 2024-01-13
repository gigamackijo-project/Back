-- Active: 1699575794799@@127.0.0.1@3306@mydb
SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `nickname` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(300) NOT NULL,
  `updated_at` DATETIME NULL DEFAULT now(),
  `point` INT NULL DEFAULT 30000,
  `birthday` DATE NOT NULL,
  `tel` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`user_id`)
);
-- -----------------------------------------------------
-- Table `mydb`.`board`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`board` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NOT NULL,
  `content` VARCHAR(1024) NOT NULL,
  `count` INT NULL DEFAULT 0,
  `createdAt` DATETIME NULL DEFAULT now(),
  `updatedAt` DATETIME NULL DEFAULT now(),
  `userId` INT NULL COMMENT 'user table(user_id)',
  `board_no` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_board_user`
    FOREIGN KEY (`userId`)
    REFERENCES `mydb`.`user` (`user_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE
);
-- -----------------------------------------------------
-- Table `mydb`.`comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` VARCHAR(1024) NOT NULL,
  `createdAt` DATETIME NULL DEFAULT now(),
  `comment_no` INT NULL DEFAULT 0,
  `boardId` INT NULL,
  `userId` INT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_comment_user`
    FOREIGN KEY (`userId`)
    REFERENCES `mydb`.`user` (`user_id`)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT `fk_comment_board`
    FOREIGN KEY (`boardId`)
    REFERENCES `mydb`.`board` (`id`)
   ON UPDATE CASCADE
    ON DELETE CASCADE
);


-- -----------------------------------------------------
-- Table `mydb`.`product`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`product` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `cost_price` INT NOT NULL,
  `sale_price` INT NOT NULL,
  `state` VARCHAR(50) NULL DEFAULT '판매중',
  `ex_date` VARCHAR(100) NOT NULL,
  `barcode` VARCHAR(100) NOT NULL,
  `info` VARCHAR(1000) NULL,
  `created_at` DATETIME NULL DEFAULT now(),
  `like_count` INT NULL DEFAULT 0,
  `sale` INT NULL,
  `imageName`  VARCHAR(256)    NULL,
  `imagePath`  VARCHAR(256)    NULL,
  `user_id` INT NULL COMMENT 'user table(user_id)',
  PRIMARY KEY (`product_id`),
  UNIQUE INDEX `bar_num_UNIQUE` (`barcode` ASC) VISIBLE,
  CONSTRAINT `fk_product_user2`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`sell`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`sell` (
  `sell_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL COMMENT 'product table(product_id)',
  `user_id` INT NULL COMMENT 'user table(user_id)',
  `sell_date` DATETIME NULL DEFAULT now(),
  PRIMARY KEY (`sell_id`),
  INDEX `fk_sell_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_sell_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_sell_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_sell_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `mydb`.`product` (`product_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


-- -----------------------------------------------------
-- Table `mydb`.`wishlist`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`wishlist` (
  `wish_id` INT NOT NULL AUTO_INCREMENT,
  `product_id` INT NULL COMMENT 'product table(product_id)',
  `user_id` INT NULL COMMENT 'user table(user_id)',
  PRIMARY KEY (`wish_id`),
  INDEX `fk_wishlist_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_wishlist_product1_idx` (`product_id` ASC) VISIBLE,
  CONSTRAINT `fk_wishlist_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `mydb`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_wishlist_product1`
    FOREIGN KEY (`product_id`)
    REFERENCES `mydb`.`product` (`product_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


SELECT * FROM user;
SELECT * FROM board;
SELECT * FROM comment;
SELECT * FROM product;
SELECT * FROM sell;
SELECT * FROM wishlist;

DROP TABLE IF EXISTS user, sell, product, board, comment, wishlist;
DROP TABLE IF EXISTS user;


INSERT INTO user(name, nickname, email, password, updated_at, point, birthday, tel) 
VALUES('홍길동', '길동닉', 'qwe@company.com', '123qwe', '2023-12-22', 30000, '2023-12-22', '010-5412-3456');

INSERT INTO user(name, nickname, email, password, updated_at, point, birthday, tel) 
VALUES('김철수', '철수닉네임', 'chulsu@company.com', 'qwe123', '2023-12-22', 30000, '2000-10-22', '010-1234-5678');

INSERT INTO board(title, content, cnt, `created_at`, `updated_at`, user_id, board_no) 
VALUES('제목', '정말어렵다 데이터베이스', 1, '2023-11-03', '2023-12-03', 1, 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('치킨', 35000, 31500, '2023-12-25','3346-6897-1285-4685', 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('족발', 35000, 53000, '2023-12-25','1155-2648-1285-4685', 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('초밥', 20000, 15000, '2023-12-25','9999-6666-1285-4685', 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('국밥', 20000, 15000, '2023-12-25','5569-6666-1285-4685', 1);


INSERT INTO sell(sell_date,product_id, user_id) 
VALUES('2088-12-12', 1, 1);

UPDATE product SET state='판매완료' where product_id = 1;
UPDATE product SET user_id = 1 where product_id IN (1,3,4);


SELECT b.user_id, b.title, b.content
FROM user u INNER JOIN board b ON u.user_id = b.user_id;

-- 구매목록 가져오기
SELECT p.name, p.sale_price, s.sell_date, p.state
FROM product p INNER JOIN sell s ON p.user_id = s.user_id
WHERE p.state = '판매완료';

-- 판매목록 가져오기
SELECT p.name, p.sale_price, s.sell_date, p.state
FROM product p INNER JOIN sell s ON p.user_id = s.user_id
WHERE p.state = '판매중';

-- 판매상품을 판매완료했을때
UPDATE product
JOIN sell ON product.user_id = sell.user_id
SET product.state = '판매완료',
    sell.sell_date = '2023-12-25'
WHERE product.product_id = 1;

SELECT p.name, p.cost_price, p.sale_price, p.state, p.ex_date, p.barcode, p.like_count, p.sale, u.name as seller_name 
               FROM sell s 
               JOIN product p ON s.product_id = p.product_id 
               JOIN user u ON s.user_id = u.user_id
               WHERE s.user_id = ? AND p.state = '판매완료';

UPDATE product p
JOIN sell s 
ON s.product_id = p.product_id 
JOIN user u ON s.user_id = u.user_id
SET p.state = '판매완료',
    s.sell_date=NOW()
WHERE s.user_id = 1;


UPDATE product SET state='판매중' where product_id IN (1,2,3);
UPDATE product SET ='판매중' where product_id IN (1,2,3);

UPDATE product SET state = '판매중' WHERE product_id = 5;


ALTER TABLE product
ALTER COLUMN state SET DEFAULT '판매중';

INSERT INTO sell(product_id, user_id) VALUES (1, 1);

SELECT p.name, p.cost_price, p.sale_price, p.state, p.ex_date, p.barcode, p.like_count, p.sale, u.name as seller_name 
                FROM sell s 
                JOIN product p ON s.product_id = p.product_id 
                JOIN user u ON s.user_id = u.user_id
                WHERE s.user_id = 1 AND p.state = '판매중';
SELECT p.name, p.cost_price, p.sale_price, p.state, p.ex_date, p.barcode, p.like_count, p.sale, u.name as seller_name 
FROM sell s 
JOIN product p ON s.product_id = p.product_id 
JOIN user u ON s.user_id = u.user_id
WHERE s.user_id = 1 AND p.state = '판매완료';

ALTER TABLE board
CHANGE COLUMN cnt count INT;

UPDATE product SET like_count = like_count + 1 WHERE product_id = 9;

SELECT user_id, name, nickname, email, updated_at, point, birthday, tel FROM user WHERE user_id = 5;

 -- ----------------------------------------------------------------------------------

DROP TABLE IF EXISTS user, sell, product, board, comment, wishlist;
SELECT * from user;
SELECT * from board;
SELECT * from comment;
SELECT * from product;
SELECT * from sell;
SELECT * from wishlist;



-- user 샘플
INSERT INTO user(name, nickname, email, password, birthday, tel) 
VALUES('놀부', '놀부닉', 'nolbu@company.com', 'abc123', '1950-12-22', '010-5412-3456');

INSERT INTO user(name, nickname, email, password, birthday, tel) 
VALUES('홍길동', '놀부닉', 'hong@company.com', 'abc456', '1800-06-15', '010-5412-3456');

INSERT INTO user(name, nickname, email, password, birthday, tel) 
VALUES('철수', '철수닉', 'chulsu@company.com', 'abc789', '2000-03-13', '010-5412-3456');

-- proudct 샘플
INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('치킨', 35000, 31500, '2023-12-25','3346-6897-1285-4685', 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('족발', 35000, 53000, '2023-12-25','1155-2648-1285-4685', 1);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('초밥', 20000, 15000, '2023-12-25','9999-6666-1285-4685', 2);

INSERT INTO product(name, cost_price, sale_price, ex_date, barcode, user_id) 
VALUES('국밥', 20000, 15000, '2023-12-25','5569-6666-1285-4685', 3);

-- sell 샘플
INSERT INTO sell(sell_date,product_id, user_id) 
VALUES('2088-12-12', 4, 2);
-- board table에 insert, update, delete, select
-- board 목록에는 항상 입력한 사용자 이름이 출력되도록..
INSERT INTO board(title, content, userId) VALUES('첫번째 게시물', '첫번째 게시물 내용', 1);
INSERT INTO board(title, content, userId) VALUES('두번째 게시물', '두번째 게시물 내용', 2);
INSERT INTO board(title, content, userId) VALUES('세번째 게시물', '세번째 게시물 내용', 3);

INSERT INTO comment(boardId, userId, content) VALUES(1, 1, '두번째 게시물 댓글 01');
INSERT INTO comment(boardId, userId, content) VALUES(1, 2, '두번째 게시물 댓글 02');
INSERT INTO comment(boardId, userId, content) VALUES(4, 5, '세번째 게시물 댓글 01');

INSERT INTO user(name, nickname, email, password, updated_at, birthday, tel) 
VALUES('홍길동', '놀부닉', 'nolbu@company.com', 'abc123', '2023-12-22', '2023-12-22', '010-5412-3456');

-- 수정