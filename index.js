import express from "express";
import { PORT,mongoURL } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";
const app=express();
app.use(express.json());

app.get('/',(req,res)=>{
    res.send('hi')
})

//to post it to backend.
app.post('/books',async (req,res)=>{
    try{
        if(!req.body.title||!req.body.author||!req.body.publishYear){
            return res.send({message:"Fill all the fields."});
        }
        const newBook={
            title:req.body.title,
            author:req.body.author,
            publishYear:req.body.publishYear,
        };
        const book=await Book.create(newBook);
        return res.send(book);
    }catch(error){
        console.log(error.message);
    }
})

//to show the books that are already present.
app.get('/books',async (req,res)=>{
    try{
        const books = await Book.find({});
        return res.json({
            count:books.length,
            data:books
        });
    } catch(error){
        console.log(error.message);
        res.send({message:error.message})
    }
})

//to find a specific book.
app.get('/books/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        const book = await Book.findById(id);
        return res.json(book);
    } catch(error){
        console.log(error.message);
        res.send({message:error.message})
    }
})

//to update a book.
app.put('/books/:id',async(req,res)=>{
    try{
        if(!req.body.title||!req.body.author||!req.body.publishYear){
            return res.send({message:"Fill all the fields."});
        }
        const{id}=req.params;
        const result=await Book.findByIdAndUpdate(id,req.body);
        if(!result){
            return res.json({message:'book not found.'});
        }
        return res.send({message:'Book has been updated Sucessfully.'})
    } catch(error){
        console.log(error.message);
        res.send({message:error.message});
    }
})

//to delete a book
app.delete('/books/:id',async (req,res)=>{
    try{
        const {id}=req.params;
        const result = await Book.findByIdAndDelete(id);
        if(!result){
            return res.send({message:"Sucessfully deleted the desired book."});
        }
    } catch(error){
        console.log(error.message);
        res.send({message:error.message});
    }
})
//backend connection.
mongoose.connect(mongoURL).then(()=>{
    console.log("Sucessfully connected to the DATABASE");
    app.listen(PORT,()=>{
        console.log("App is running.");
    })
}).catch((error)=>{
    console.log(error);
})