---
description: "La signification des codes d'erreur réseau à l'origine des problèmes de serveur BeamMP, comme 10048 et 10060, et que faire dans chaque cas."
---
# Codes d'erreur serveur

Cette page liste les codes d'erreur réseau que vous pouvez rencontrer lorsque vous faites tourner un serveur, et ce qu'il faut faire dans chaque cas. Le serveur lui-même affiche le texte de l'erreur, par exemple après `bind() failed:`, et non le numéro. Les numéros sont les codes d'erreur Windows Sockets que le lanceur et Windows affichent.


| Code  | Description                                | Solution possible                                                                                                     |
|-------|--------------------------------------------|-----------------------------------------------------------------------------------------------------------------------|
| 10022 | Problème de liaison au port | Vérifiez si le port du serveur est déjà utilisé par un autre service ; si c'est le cas, utilisez-en un autre.                      |
| 10048 | Adresse déjà utilisée                     | Un autre serveur BeamMP ou un autre programme fonctionne sur ce port, utilisez-en un autre.                                            |
| 10051 | Réseau inaccessible                        | Mauvaise redirection de port ou problème similaire, vérifiez que tout est correctement configuré.                                        |
| 10052 | Réseau réinitialisé                              | Se produit si le réseau coupe la connexion pendant son établissement. Réessayez de vous connecter.                |
| 10053 | Connexion interrompue                         | Causé par un délai d'attente dépassé ou une erreur réseau, réessayez de vous connecter.                                                             |
| 10054 | Connexion réinitialisée par le pair                   | Un client s'est déconnecté de votre serveur.                                                                           |
| 10060 | Délai de connexion dépassé                       | Il y a un problème avec votre redirection de port, consultez les [étapes de redirection de port](/fr/server-owners/host-a-server#forward-the-port). |
| 10061 | Connexion refusée                         | Il y a un problème avec votre redirection de port, consultez les [étapes de redirection de port](/fr/server-owners/host-a-server#forward-the-port). |
| 10064 | Hôte hors service                                  | Erreur peu probable, mais elle signifie que l'hôte est hors service, soit parce qu'il est éteint, soit parce que des ports ont été fermés.                 |
| 10065 | Hôte injoignable                         | Pas d'Internet ou mauvaise redirection de port, consultez les [étapes de redirection de port](/fr/server-owners/host-a-server#forward-the-port).          |

Pour un code qui ne figure pas dans cette liste, consultez les [codes d'erreur Windows Sockets](https://learn.microsoft.com/en-us/windows/win32/winsock/windows-sockets-error-codes-2), si vous vous y connaissez un peu en réseaux et en sockets.
