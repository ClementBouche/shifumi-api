# Aggregate vs Query


```js
const playerid = mongoose.Types.ObjectId(req.params.playerid);
Player.aggregate()
  .match({ _id: playerid })
  .limit(1)
  .project(projection)
  .addFields({ user_id: { $toObjectId: "$user_id" } })
  .lookup({ from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' })
  .unwind('user')
  .exec((error, result) => {
    console.log(result);
    if (result.error) return res.send(error);
    if (result && result[0]) {
      return res.json(result[0]);
    }
    return res.sendStatus(404);
  });
```

vs


```js
Player.findById(req.params.playerid, projection)
  .exec((err, player) => {
    if (err || !player) return res.sendStatus(404);
    if (!player.user_id) return res.json(player);
    // conditional 'lookup' for user
    User.findById(player.user_id, userProjection).exec((err, user) => {
      if (err || !user) return res.json(player);
      // return merged player && user
      const result = Object.assign({}, player.toJSON(), {user: user.toJSON()});
      res.json(result);
    });
  });
```
