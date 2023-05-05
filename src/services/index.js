import { User } from "../dao/daoUserMongo.js";
import {Products} from "../dao/daoProductsMongo.js";
import { Cart } from "../dao/daoCartsMongo.js";
import { Messages } from "../dao/daoMessageMongo.js";
import { Ticket } from "../dao/daoTicketMongo.js";

import { UserService } from "./user.service.js";
import { ProductService } from "./product.service.js";
import { CartService } from "./cart.service.js";
import { MessageService } from "./message.service.js";
import { TicketService } from "./ticket.service.js";



export const userService=new UserService(new User());
export const productService=new ProductService(new Products());
export const cartService=new CartService(new Cart());
export const messageService=new MessageService(new Messages());
export const ticketService=new TicketService(new Ticket());