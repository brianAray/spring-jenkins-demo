package com.example.jenkins_demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {

    @Autowired
    private ItemRepository itemRepository;

    @GetMapping
    public List<Item> getAllItems(){
        return itemRepository.findAll();
    }

    @PostMapping
    public Item createItem(@RequestBody Item item){
        return itemRepository.save(item);
    }
}
