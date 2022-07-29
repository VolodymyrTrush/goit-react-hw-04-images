import { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ImageGallery } from 'components/ImageGallery';
import { Searchbar } from 'components/Searchbar';
import { Container } from 'components/Container';
import { getImages } from 'services/api';
import { Modal } from 'components/ui/Modal';
import { LoaderContainer } from 'components/LoaderContainer';
import { theme } from 'stylesConfig/theme';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeimageURL, setActiveimageURL] = useState(null);

  useEffect(() => {
    if (searchQuery === '') {
      return;
    }
    const fetchGalleryItems = () => {
      setIsLoading(true);
      getImages(searchQuery, page)
        .then(res => {
          setItems(prevState => [...prevState, ...res]);
          setIsLoading(false);
          if (res.length === 0) {
            return toast.error(
              'Oh, the search results were not successful :( Try again.'
            );
          }
        })
        .catch(error => {
          toast.error('Sorry, there is ' + error.message);
          setIsLoading({ isLoading: false });
        });
    };

    fetchGalleryItems();
  }, [page, searchQuery]);

  const closeModal = () => {
    setActiveimageURL(null);
  };

  const handleSubmit = ({ searchQuery }) => {
    if (searchQuery.trim() !== '') {
      setSearchQuery(searchQuery);
      setPage(1);
      setIsLoading(false);
      setItems([]);
      return;
    }
  };

  const loadMore = () => {
    setPage(page => page + 1);
  };

  return (
    <Container>
      <Searchbar onSubmit={handleSubmit} loadMore={loadMore} />

      <ToastContainer autoClose={3000} />
      {isLoading && (
        <LoaderContainer>
          <ThreeDots color={theme.colors.searchBarBgc} />
        </LoaderContainer>
      )}

      {items.length !== 0 && (
        <ImageGallery
          items={items}
          setActiveImageURL={setActiveimageURL}
          loadMore={loadMore}
        />
      )}
      {activeimageURL && (
        <Modal activeimageURL={activeimageURL} onClose={closeModal} />
      )}
    </Container>
  );
};
