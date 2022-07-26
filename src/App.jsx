import { useState, useEffect } from 'react';
import { SearchBar} from "./components/SearchBar/SearchBar";
import { AppStyled } from "./components/App.container";
import { Button } from "./components/Button/Button";
import { Loader } from "./components/Loader/Loader";
import { Modal } from "./components/Modal/Modal";
import { ImageGallery } from "./components/ImageGallery/ImageGallery";
// import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { ToastContainer, toast } from "react-toastify";
import { fetchImages } from "service/imgApi";

export const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [largeImg, setLargeImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    if (query.trim() === '') {
      return;
    }
    async function getImages() {
      try{
        const foundImages = await fetchImages(query, page);
        const imageMapper = imgList => {
          return imgList.map(({ id, webformatURL, largeImageURL, tags }) => {
            return { id, webformatURL, largeImageURL, alt: tags };
          });
        };
        setImages(prevImg => [...prevImg, ...imageMapper(foundImages)]);
      } catch {
        return toast.error("Sorry, we didn't find anything");
      } finally {
        setIsLoading(false);
      }
    }
    getImages();
  }, [query, page]);

  const onChangeQuery = query => {
    setQuery(query);
    setPage(1);
    setImages([]);
  };

  const loadMore = () => {
    setPage(page + 1);
  };

  const toggleLargeMode = largeImg => {
    setLargeImg(largeImg);
  };

    return (
      <AppStyled>
        <SearchBar onSubmit={onChangeQuery} />
        <ToastContainer autoClose={3000} />
        {isLoading ? <Loader /> : null}
        {images.length > 0 && (
          <ImageGallery
            images={images}
            toggleLargeMode={toggleLargeMode}
            />
        )}
        {images.length > 0 && !isLoading && <Button onClick={loadMore} />}
        {largeImg && (
        <Modal largeImg={largeImg.url} alt={query} onClose={toggleLargeMode} />
      )}
      </AppStyled>
    );

}  