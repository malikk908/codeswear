import React, { useState } from 'react'
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../src/theme/theme";
import FullLayout from "../../src/layouts/FullLayout";
import {
    Grid,
    Stack,
    TextField,
    Checkbox,
    FormGroup,
    FormControlLabel,
    RadioGroup,
    Radio,
    FormLabel,
    FormControl,
    MenuItem,
    InputLabel,
    Button,
    Select
} from "@mui/material";
import BaseCard from './components/baseCard/BaseCard';
import { toast } from 'react-toastify';
import axios from 'axios'



const Addproduct = () => {

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState('')
    const [slug, setSlug] = useState('')
    const [category, setCategory] = useState('')
    const [size, setSize] = useState('')
    const [color, setColor] = useState('')
    const [quantity, setQuantity] = useState('')
    const [price, setPrice] = useState('')

    const handleChange = (e) => {
        if (e.target.name == 'title') {
            setTitle(e.target.value)
        }
        if (e.target.name === 'description') {
            setDescription(e.target.value)
        }
        if (e.target.name === 'image') {
            setImage(e.target.value)
        }
        if (e.target.name === 'slug') {
            setSlug(e.target.value)
        }
        if (e.target.name === 'category') {
            setCategory(e.target.value)
        }
        if (e.target.name === 'size') {
            setSize(e.target.value)
        }
        if (e.target.name === 'color') {
            setColor(e.target.value)
        }
        if (e.target.name === 'quantity') {
            setQuantity(e.target.value)
        }
        if (e.target.name === 'price') {
            setPrice(e.target.value)
        }

    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post(
                `/api/addproduct`,
                {
                    
                        title,
                        description,
                        image,
                        slug,
                        category,
                        size,
                        color,
                        quantity,
                        price
                    
                }
            );

            toast.success(data.message)
            setTitle('')
            setDescription('')
            setImage('')
            setSlug('')
            setCategory('')
            setSize('')
            setColor('')
            setQuantity('')
            setPrice('')

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }


    return (
        <ThemeProvider theme={theme}>
            <style jsx global>{`
        footer {
          display: none;
        }
      `}</style>
            <FullLayout>

                <Grid container spacing={0}>
                    <Grid item xs={12} lg={12}>
                        <BaseCard title="Add a Product">
                            <Stack spacing={3}>
                                <TextField
                                    id="title-basic"
                                    name='title'
                                    value={title}
                                    onChange={handleChange}
                                    label="Title"
                                    variant="outlined"
                                />
                                <TextField
                                    id="description-basic"
                                    name='description'
                                    value={description}
                                    onChange={handleChange}
                                    label="Description"
                                    multiline
                                    rows={4}
                                />
                                <TextField
                                    id="image-basic"
                                    name='image'
                                    value={image}
                                    onChange={handleChange}
                                    label="Image Link"
                                    variant="outlined"
                                />
                                <TextField
                                    id="slug-basic"
                                    name='slug'
                                    value={slug}
                                    onChange={handleChange}
                                    label="Slug"
                                    variant="outlined"
                                />
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="category-basic"
                                        name='category'
                                        value={category}
                                        label="Category"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'tshirt'}>Tshirt</MenuItem>
                                        <MenuItem value={'hoodies'}>Hoodies</MenuItem>
                                        <MenuItem value={'stickers'}>Stickers</MenuItem>
                                        <MenuItem value={'mugs'}>Mugs</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Size</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="size-basic"
                                        name='size'
                                        value={size}
                                        label="Category"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'S'}>Small</MenuItem>
                                        <MenuItem value={'M'}>Medium</MenuItem>
                                        <MenuItem value={'L'}>Large</MenuItem>
                                        <MenuItem value={'XL'}>Extra Large</MenuItem>
                                        <MenuItem value={'XXL'}>Double XL</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="demo-simple-select-label">Color</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="color-basic"
                                        name='color'
                                        value={color}
                                        label="Color"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={'blue'}>Blue</MenuItem>
                                        <MenuItem value={'red'}>Red</MenuItem>
                                        <MenuItem value={'yelllow'}>Yelllow</MenuItem>
                                        <MenuItem value={'purple'}>Purple</MenuItem>
                                        <MenuItem value={'green'}>Green</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    id="price-basic"
                                    name='price'
                                    value={price}
                                    onChange={handleChange}
                                    type='number'
                                    label="Price"
                                    variant="outlined"

                                />
                                <TextField
                                    id="quantity-basic"
                                    name='quantity'
                                    value={quantity}
                                    onChange={handleChange}
                                    type='number'
                                    label="Quantity"
                                    variant="outlined"
                                />

                            </Stack>
                            <br />
                            <Button onClick={handleSubmit} variant="outlined" mt={2}>
                                Submit
                            </Button>
                        </BaseCard>
                    </Grid>


                </Grid>

            </FullLayout>
        </ThemeProvider>
    )
}

export default Addproduct
