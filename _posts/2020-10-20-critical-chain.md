---
layout: post
title: Critical Chain
---

J'aime beaucoup le livre *"Le But"* de Eliyahu M. Goldratt, il y raconte sous forme romancée l'histoire d'un directeur d'usine qui découvre la théorie des contraintes. Avec l'aide d'un professeur de physique il apprend les notions de Work In Progress (WIP), Throughput et Inventory dans un sens particulier qui lui permettent de voir les problèmes de son usine.

![couvertures]({{ site.baseurl }}/images/critical_chain/covers.png "couvertures")

Dans le livre *"Critical Chain"* on retrouve de nouveau de manière romancée la théorie des contraintes, cette fois-ci appliquée à la gestion de projet. Et ce que j'y ai appris m'a énormément surpris, je vais essayer de restituer ici le point qui m'a le plus intéressé.

## Le problème

Partons de quelques observations :

1. Dans mon expérience il est exceptionnel de finir un projet en avance et assez rare de finir le projet juste à temps. En résumé la plupart des projets sont en retard. 
2. Lorsqu'on évalue le temps qu'il faut pour effectuer une tâche dans un projet, on aura tendance à y ajouter un marge. Cette marge sert généralement à gérer le risque. Et cette marge sera d'autant plus grande que les projets sur lesquels on a travaillé récemmment ont été en retard.
3. On observe que 9 + 9 = 20. La personne qui agrège les estimations (chef de projet, chef d'équipe) va rajouter une marge supplémentaire.
4. On sait que probablement quelqu'un à un niveau de hiérarchie va trouver "trop coûteux" et voudra rabaisser de 20% le chiffrage, donc on ajoute encore 25% à l'estimation pour palier à ce cas.

Est-ce que ces observations sont cohérentes par rapport à votre vécu ?

Mais est-ce que ces observations ne sont pas incompatibles ? 

Comment ça se fait que malgré toutes ses marges cumulées les projets sont quand même très souvent en retard ?

## Et en plus...

Réfléchissons un peu à comment les estimations sont faites. Reprenons l'exemple du livre : Combien de temps me faut-il pour aller de mon travail à chez moi ?

La réponse rapide serait 25 minutes. 

Mais est-ce que ce sera 25 minutes à chaque fois ? Bien sûr que non. 

Si je fait du zèle, qu'il n'y a personne sur la route, que le vent va dans le bon sens, je peux le faire en 15 minutes mais vraisemblablement pas moins.

Par contre, si il y a un bouchon ou un accident sur la route, je peux prendre 50 minutes. 

Pire si mon collègue m'invite à m'arrêter dans un bar, ça peux prendre 2 heures. Voir 5 heures si on enchaîne par un resto...

Dans ce cas la distribution de probabilité n'est pas une distribution normale, une courbe en cloche. La distribution ressemblera d'avantage à une courbe avec un pic au niveau des 25 minutes et une très longue queue.

L'impact que ça a c'est que pour passer d'un niveau de confiance à 50% à un niveau de confiance à 80% la différence de temps est très grande. Dans une courbe en cloche les 80% de confiance vont ajouter environ 40% de temps, dans une courbe alongée les 80% de confiance vont ajouter 200% de temps.

![distributions probabilité]({{ site.baseurl }}/images/critical_chain/critical_chain_distribution.png "distributions probabilité")

On a donc prit une marge extrêmement grande en temps pour se prémunir contre les risques.

## L'explication

Dans le livre Goldratt (enfin les personnage qu'il met en scène) présente 3 explications :

- __le syndrôme de l'étudiant__ : on va attendre la dernière minute pour commencer la tâche et se rendre compte qu'on l'a commencé trop tard pour avoir le temps de la faire avant la date limite.
- __la loi de Parkinson__ : si on a 10 jours pour faire une tâche, la tâche prendra 10 jours. Le travail s'étendra pour occuper tout le temps alloué.
- __le multi-tasking__ : on va travailler en parallèle sur plusieurs tâches ce qui les fera toutes se terminer plus tard que réellement nécessaire.

## Dans mon cas

Le syndrôme de l'étudiant et le multi-tasking sont intéressant dans le cadre d'un projet organisé en étapes successives et notamment visible dans un diagramme de Gantt. Mais pour mon cas, je travaille avec une très petite équipe et ces effets ne sont pas significatifs.

Par contre la loi de Parkinson m'intéresse beaucoup. J'observe que :

1. les estimations contiennent une marge de sécurité 
2. quasiment aucune tâche ne se finit "en avance" 
3. la plupart des tâches finissent "à temps"
4. quelques tâches se finissent en retard

Il est possible qu'on ait réeelement sous-estimé toutes les tâches et que finalement il n'y ait pas de marge mais dans ce cas je m'attendrais à avoir d'avantage de tâches en retard.

Quoi qu'il en soit, chaque tâche qui se termine en retard va repousser la fin du projet. Et comme quasiment aucune tâche ne fini en avance il n'y a quasiment aucune chance de rattraper notre retard.

D'autre part ce qui m'inquiète c'est que on pourrait essayer de trouver des optimisations, des outils ou d'autres techniques pour "accélérer". Mias si la loi de Parkinson est vrai et si les estimations sont déjà faites toutes ces améliorations n'auront aucun effet, une tâche de 10 jours prendra toujours 10 jours.

Je me rend également compte que des pratiques "normales" vont exacerbé ce problème : 

 - on va avoir tendance à chiffrer le temps nécessaire pour corriger les bugs pour prédire une date de fin ce qui met en place les informations nécessaire à l'application de la loi de Parkinson
 - on va vouloir que les développeurs notent les heures qu'ils passent sur les stories ce qui leurs donne l'occasion de penser _"C'est bon j'ai encore du temps..."_

## La solution (?)

La _"solution"_ mise en place dans le livre est de réduire les estimation de 1/3 (en gros revenir à une estimation à 50%) et d'ajouter un buffer à la fin du projet. Je pense que dans mon cas ça pourrait être intéressant, réduire toutes les estimations en disant clairement qu'y a aucun problème si une tâche prend plus que l'estimation prévue (par définition si on prend l'estimation à 50% en théorie la moitié des tâches doivent dépasser) et ajouter un buffer qu'on pourrait mettre à jour régulièrement.

Je me demande aussi si des solutions "no estimate" pourraient palier à ce problème, soit ne pas estimer du tout, soit avoir une notion de "bonne taille" ou "trop gros" et les "tros gros" doivent être découpés.

Une autre idée qui m'a été suggérée par un collègue : utiliser des couleurs plutôt que des chiffres. On a trop vite tendance à traduire un nombre de points en nombre de jours et du coup à se mettre dans une situation où on applique la loi de Parkinson. J'aime particulièrement l'idée d'utiliser les couleurs des pistes de ski, ça nous aiderait à découpler l'effort en temps et la difficulté en complexité.






