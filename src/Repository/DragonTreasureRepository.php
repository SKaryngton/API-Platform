<?php

namespace App\Repository;

use App\Entity\DragonTreasure;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\Query;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<DragonTreasure>
 *
 * @method DragonTreasure|null find($id, $lockMode = null, $lockVersion = null)
 * @method DragonTreasure|null findOneBy(array $criteria, array $orderBy = null)
 * @method DragonTreasure[]    findAll()
 * @method DragonTreasure[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class DragonTreasureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DragonTreasure::class);
    }

        public function findAllQuery(): Query
        {
        return $this->createQueryBuilder('d')
            ->getQuery();
    }
    public function findByNameLike(string $name): Query
    {
        return $this->createQueryBuilder('d')
            ->where('d.name LIKE :query')
            ->setParameter('query', '%' . $name . '%')
            ->getQuery();
    }

    public function findByOwnerUsername(string $name):Query
    {
        return $this->createQueryBuilder('d')
            ->join('d.owner', 'o')
            ->where('o.username = :query')
            ->setParameter('query', $name)
            ->getQuery();
    }


    public function findByFilters($filters)
    {
        $qb = $this->createQueryBuilder('d');

        if (isset($filters['user'])) {
            $qb->join('d.owner', 'o')
                ->where('o.username = :query')
                ->setParameter('query', $filters['user'])
                ->getQuery();
        }

        if (isset($filters['startDate'])) {
            $qb->andWhere('d.createdAt >= :startDate')
                ->setParameter('startDate', $filters['startDate']);
        }

        if (isset($filters['endDate'])) {
            $qb->andWhere('d.createdAt <= :endDate')
                ->setParameter('endDate', $filters['endDate']);
        }

        return $qb->getQuery();
    }



    //    /**
//     * @return DragonTreasure[] Returns an array of DragonTreasure objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('d.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?DragonTreasure
//    {
//        return $this->createQueryBuilder('d')
//            ->andWhere('d.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }

}
