import { CATEGORYS, MainGame as GameBase } from "common/scripts/game.ts"
import { DefaultSignals, Renderer,Client,KeyListener,MousePosListener, Key } from "KLSE/CLIENT";
import { JoinPacket } from "common/scripts/packets/join_packet.ts"
import { GameConstants, PacketManager } from "common/scripts/constants.ts"
import { Player } from "./gameObjects/player.ts";
import { NewPlayer, ProjectileObj } from "common/scripts/gameObjects/objectsDefinitions.ts";
import { UpdatePacket } from "common/scripts/packets/update_packet.ts";
import { ActionPacket } from "common/scripts/packets/action_packet.ts";
import { BaseGameObject, NullVector } from "KLSE";
import { StatePacket } from "common/scripts/packets/state_packet.ts";
import { Projectile } from "./gameObjects/projectile.ts";
export class Game extends GameBase{
    renderer:Renderer
    client:Client
    input:KeyListener
    mouse:MousePosListener
    action_packet:ActionPacket
    constructor(game:string,input:KeyListener,mouse:MousePosListener,renderer:Renderer){
        super(GameConstants.tps,GameConstants.collision.threads,GameConstants.collision.chunckSize)
        this.renderer=renderer
        this.input=input
        this.mouse=mouse
        this.client=new Client(new WebSocket(game+"/ws"),PacketManager)
        this.action_packet=new ActionPacket(NullVector)
        this.handleSignals()
    }
    addPlayer(np:NewPlayer):Player{
        const player=new Player()
        player.renderer=this.renderer
        player.fromNewPlayer(np)
        this.add_object(CATEGORYS.PLAYERS,player,player.id)
        return player
    }
    addProjectile(proj: ProjectileObj): BaseGameObject {
      const pro=new Projectile()
      pro.renderer=this.renderer
      pro.fromObj(proj)
      this.add_object(CATEGORYS.PROJECTILES,pro)
      return pro
  }
    update(): void {
      this.renderer.clear()
      GameBase.prototype.update.call(this)
      if(this.input.keyPress(Key.A)){
        this.action_packet.Movement.x=-1
      }else if(this.input.keyPress(Key.D)){
        this.action_packet.Movement.x=1
      }else{
        this.action_packet.Movement.x=0
      }

      if(this.input.keyPress(Key.W)){
        this.action_packet.Movement.y=-1
      }else if(this.input.keyPress(Key.S)){
        this.action_packet.Movement.y=1
      }else{
        this.action_packet.Movement.y=0
      }
      this.client.emit(this.action_packet)
      this.input.tick()
    }

    //Handle Signals
    handleSignals(){
      this.client.on(DefaultSignals.CONNECT,()=>{
        this.client.emit(new JoinPacket({Id:this.client.ID,Name:GameConstants.player.defaultName,Position:NullVector}))
      })

      this.client.on("state",(p:StatePacket)=>{
        for(const i of Object.keys(this.categorys)){
          this.categorys[i].objs={}
          this.categorys[i].orden=[]
        }
        
        for(let i=0;i<p.players.length;i++){
          this.addPlayer(p.players[i])
        }
      })

      this.client.on("update",(p:UpdatePacket)=>{
          for(let i=0;i<p.updatedPlayers.length;i++){
              if(this.havePlayer(p.updatedPlayers[i].id)){
                this.get_object(CATEGORYS.PLAYERS,p.updatedPlayers[i].id).hb.position=p.updatedPlayers[i].pos
              }
          }
          for(let i=0;i<p.newPlayers.length;i++){
            if(!this.havePlayer(p.newPlayers[i].Id)){
              this.addPlayer(p.newPlayers[i])
            }
          }
          for(const i of p.removedObjects){
            if(this.exist_object(i.category,i.id)){
              this.categorys[i.category].objs[i.id].destroyed=true
            }
          }
          for(let i=0;i<p.newProjectiles.length;i++){
            this.addProjectile(p.newProjectiles[i])
          }
      })
    }
}
export async function getGame(server:string){
    return `/api/${await(await fetch(`${server}/api/get-game`)).text()}`
}