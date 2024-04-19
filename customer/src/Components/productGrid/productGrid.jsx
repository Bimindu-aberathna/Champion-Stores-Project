import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import './productGrid.css';

const Products = [
  {
    name: "Kumarika 100g",
    price: 150,
    status: true,
    image:
      "https://cdn1.arogga.com/eyJidWNrZXQiOiJhcm9nZ2EiLCJrZXkiOiJQcm9kdWN0LXBfaW1hZ2VzXC82MTE3MlwvNjExNzIta3VtYXJpa2EtaGVyYmFsLWJlYXV0eS1zb2FwLTEwMC1nbS0xcmQ2aGcuanBlZyIsImVkaXRzIjpbXX0=",
  },
  {
    name: "Dove milk protein 180ml",
    price: 750,
    status: false,
    image:
      "https://www.bigbasket.com/media/uploads/p/l/266685-2_5-dove-intense-repair-shampoo.jpg",
  },
  {
    name: "Wow Lip Balm Liquid Lipstick Waterproof Long Lasting Lip Gloss Mask Moisturizer Makeup Tear Pull Lip Lint Cosmetics",
    price: 450,
    status: true,
    image: "https://static-01.daraz.lk/p/e327f2a91596165af2e73c5959e15411.jpg",
  },
  {
    name: "35g foundation",
    price: 600,
    status: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6zQn9eS20NXT9YpSJLvGNWABAYCARGGiVnOjPEIAjBw&s",
  },
  {
    name: "Janet Real Papaya No Marks Face Wash - 100Ml",
    price: 700,
    status: false,
    image: "https://static-01.daraz.lk/p/e47bc9459442486b1f0c35e85b192c1f.jpg",
  },
  {
    name: "Janet Pink Rose Moisturising Vitamin E Cream 50G",
    price: 750,
    status: true,
    image: "https://static-01.daraz.lk/p/175660be8907c095994d849d31fb8234.jpg",
  },
  {
    name: "Sunsilk Soft & Smooth Shampoo, 180Ml",
    price: 520,
    status: true,
    image:
      "https://media6.ppl-media.com//tr:h-235,w-235,c-at_max,dpr-2/static/img/product/307440/sunsilk-nourishing-soft-and-smooth-shampoo-180-ml-1_5_display_1621236500_96356ba3.jpg",
  },
  {
    name: "Tresemme keratin smooth shampoo and conditioner 700ml",
    price: 6000,
    status: false,
    image:
      "data:image/jpeg;base64,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",
  },
  {
    name: "Benetton Fashion Genuine Leather Wallets",
    price: 1250,
    status: true,
    image:
      "https://static-01.daraz.lk/p/c8c382113f06c809ac34a6cd6ab11d25.jpg_750x400.jpg_.webp",
  },
  {
    name: "36 Pcs Mini Children Foam Mats Letters Numbers Baby Kids Early Educational Puzzle Blocks Floor Children Soft Mat Alphabet Toys",
    price: 500,
    status: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSui6CaLQscnAOM5MeQH4etwwGZ-ltM57AYP60RtJ3Olg&s",
  },
  {
    name: "2WD Remote Control Off Road Climbing Jeep High Speed Car for Boys Kids & Adults",
    price: 2200,
    status: true,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGKIM4p8_ZqV0JLajx4c_n92e_sEQd4kpAGGVLiLDy3KLvX5-jabE0xudsKro8zgz7Ugk&usqp=CAU",
  },
];
const noImage =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

export default function ProductGrid() {
  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid
        container
        spacing={2}
        sx={{
          "--Grid-borderWidth": "1px",
          borderTop: "var(--Grid-borderWidth) solid",
          borderLeft: "var(--Grid-borderWidth) solid",
          borderColor: "divider",
          "& > div": {
            borderRight: "var(--Grid-borderWidth) solid",
            borderBottom: "var(--Grid-borderWidth) solid",
            borderColor: "divider",
          },
        }}
      >
        {/* <div class="card">
  <img src="https://mdbcdn.b-cdn.net/img/new/standard/nature/184.webp" class="card-img-top" alt="Fissure in Sandstone"/>
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#!" class="btn btn-primary" data-mdb-ripple-init>Button</a>
  </div>
</div> */}
        {Products.map((product) => (
          <Grid key={product.id} item xs={12} sm={6} md={4} lg={2}>
          <div class="card">
            <img src={product.image} className="card-img-top" alt="Product" />
            <div class="card-body">
              <h6 class="card-productName">{product.name}</h6>
              <p class="card-productPrice">Rs. {product.price}.00</p>
              <a href="#!" class="btn btn-primary" data-mdb-ripple-init>
                Button
              </a>
            </div>
          </div>
        </Grid>
        
        ))}
        {/* {[...Array(6)].map((_, index) => (
          <Grid key={index} {...{ xs: 12, sm: 6, md: 4, lg: 2 }} minHeight={160} />
        ))} */}
      </Grid>
    </Box>
  );
}
