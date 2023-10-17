
**Dates valides :**

 - `2023-01-01 00:00`
 - `2023-01-23 23:10`
1. Dates avec 31 jours:
  - `2023-01-31 12:00`
  - `2023-03-31 23:59`
  - `2023-05-31 15:30`
  - `2023-07-31 00:00`
  - `2023-08-31 10:10`
  - `2023-10-31 20:20`
  - `2023-12-31 05:05`

2. Dates avec 30 jours:
  - `2023-04-30 12:00`
  - `2023-06-30 23:59`
  - `2023-09-30 15:30`
  - `2023-11-30 00:00`

3. Dates avec 28 jours:
  - `2023-02-28 12:00`

4. 29 février des années bissextiles:
  - `2024-02-29 12:00` (2024 est une année bissextile)

**Dates non valides :**

1. Mois avec des jours non autorisés:
  - `2023-02-30 12:00` (Février n'a pas 30 jours en 2023)
  - `2023-04-31 12:00` (Avril n'a que 30 jours)
  - `2023-06-31 12:00` (Juin n'a que 30 jours)

2. 29 février des années non bissextiles:
  - `2023-02-29 12:00` (2023 n'est pas une année bissextile)

3. Formats incorrects ou données erronées:
  - `2023/02/28 12:00` (Utilisation de / au lieu de -)
  - `2023-02-28T12:00` (Utilisation de T au lieu d'un espace)
  - `23-02-28 12:00` (Année incomplète)
  - `2023-02-28 12:60` (Minute incorrecte)

