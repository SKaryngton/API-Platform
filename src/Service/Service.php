<?php

namespace App\Service;

class Service
{

    public function dateToStr(?\DateTime $dateTime): ?string
    {

        if ($dateTime === null) {
            return null;
        }
        $format = 'Y-m-d H:i:s'; // Définissez le format de la date souhaité
        return $dateTime->format($format);
    }

    public function strToDate(?string $str): ?\DateTime
    {

        $format = 'Y-m-d H:i:s'; // Définissez le format de la date souhaité
        return \DateTime::createFromFormat($format, $str);
    }

}
