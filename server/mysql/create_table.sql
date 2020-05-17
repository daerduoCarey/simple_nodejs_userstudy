CREATE DATABASE simple_nodejs_userstudy;

USE simple_nodejs_userstudy;

CREATE TABLE results
(
  annotationID   BIGINT(20) AUTO_INCREMENT        PRIMARY KEY,
  algAStruct INT NOT NULL,
  algAGeo INT NOT NULL,
  algAAll INT NOT NULL,
  algBStruct INT NOT NULL,
  algBGeo INT NOT NULL,
  algBAll INT NOT NULL,
  algCStruct INT NOT NULL,
  algCGeo INT NOT NULL,
  algCAll INT NOT NULL
)
  ENGINE = InnoDB;
