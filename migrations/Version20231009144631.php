<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231009144631 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__dragon_treasure AS SELECT id, name, description, value, cool_factor, created_at, is_published FROM dragon_treasure');
        $this->addSql('DROP TABLE dragon_treasure');
        $this->addSql('CREATE TABLE dragon_treasure (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, owner_id INTEGER NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, value INTEGER NOT NULL, cool_factor INTEGER NOT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , is_published BOOLEAN NOT NULL, CONSTRAINT FK_9E31BF5F7E3C61F9 FOREIGN KEY (owner_id) REFERENCES user (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('INSERT INTO dragon_treasure (id, name, description, value, cool_factor, created_at, is_published) SELECT id, name, description, value, cool_factor, created_at, is_published FROM __temp__dragon_treasure');
        $this->addSql('DROP TABLE __temp__dragon_treasure');
        $this->addSql('CREATE INDEX IDX_9E31BF5F7E3C61F9 ON dragon_treasure (owner_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TEMPORARY TABLE __temp__dragon_treasure AS SELECT id, name, description, value, cool_factor, created_at, is_published FROM dragon_treasure');
        $this->addSql('DROP TABLE dragon_treasure');
        $this->addSql('CREATE TABLE dragon_treasure (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, value INTEGER NOT NULL, cool_factor INTEGER NOT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , is_published BOOLEAN NOT NULL)');
        $this->addSql('INSERT INTO dragon_treasure (id, name, description, value, cool_factor, created_at, is_published) SELECT id, name, description, value, cool_factor, created_at, is_published FROM __temp__dragon_treasure');
        $this->addSql('DROP TABLE __temp__dragon_treasure');
    }
}
