# Tusmo

Tâches à créer en JS :

Saisie du mot :
- Afficher lettres sur la première ligne lors de la saisie sur clavier physique/virtuel => Validé
- Afficher la première lettre du mot dans la première ligne => Validé
- Au prochain tour, les lettres validés doivent se mettre au même endroit sur la prochaine ligne => Validé
- Gérer le bug d'affichage avec la lettre qui reste jaune alors qu'elle a été validé en vert (A confirmer) => Validé
- Les lettres qui ont déjà été utilisés sont grisées => Validé
- Les lettres qui ont été validés sont de couleur verte => Validé
- Les lettres qui ont été validés et qui ne sont plus dans le mot ne peuvent plus être utilisé => Validé
- Les lettres mal placés sont en jaune => Validé

Générateur :
- Générer un mot aléatoire => Validé
- Augmenter la taille de la liste => Validé
- Faire un tri dans les mots => Validé
- Faire en sorte que ce soit le même mot pendant 24h (Optionnel)

Grille de jeu :
- Compteur qui affiche les tentatives => Validé

Validation : 
- Obliger l'utilisateur à saisir exactement 5 lettres => Validé
- Si l'utilisateur ne saisie pas exactement 5 lettres, remettre la ligne à 0 => Validé
- Le mot appartient à une liste de mots autorisés => Validé

Feedback visuel :
- Après validation, chaque case prend la couleur correspondante (vert/jaune/gris) => Validé
- Après validation, chaque case prend la couleur correspondante avec une animation 

Fin de partie : 
- Affichage d'un message de victoire ou de défaite, avec révélation du mot en cas d'échec => Validé

Nouvelle partie : 
- Possibilité de rejouer (nouveau mot du jour le lendemain, ou bouton "Rejouer" pour un mot aléatoire selon les choix techniques) => Validé
- Replacer le bouton "Recommencer" => Validé
- Fix le bug du bouton "Recommencer" qui continue a être actif après le click => Validé

Soundboard : 
- S'occuper de la soundboard lors de l'apparition du skeleton => Julien
- S'occuper de la soundboard lors du click pour valider le mot => Validé
- S'occuper de la soundboard lorsque l'utilisateur a trouvé le bon mot => Validé
- Gérer le problème de son lorsque l'utilisateur épuise ses tentatives (SoundFail et SoundFault sont joués en même temps) => Validé


Tâches à effectuer en CSS :
  - S'occuper des bordures internes au niveau des .cell => Validé
  - S'occuper du skeleton 

