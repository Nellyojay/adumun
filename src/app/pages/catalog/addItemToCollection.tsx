import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { Navbar } from '../../components/Navbar';
import ScrollToTop from '../../constants/scrollToTop';
import { useCatalog } from '../../contexts/catalogContext';
import { useStartup } from '../../contexts/StartupProfileContext';
import { useUserData } from '../../contexts/userDataContext';
import SuccessMessage from '../../components/SuccessMessage';
import supabase from '../../supabaseClient';
import { FOLDER, imageHandlerService } from '../../constants/imageHandler';

export function AddItemToCollection() {
  const navigate = useNavigate();
  const { startupId, collection: collectionParam } = useParams<{ startupId?: string; collection?: string }>();
  const { collections } = useCatalog();
  const { startupData } = useStartup();
  const { currentUser } = useUserData();
  const collection = decodeURIComponent(collectionParam || '');
  const normalizedCollection = collection.toLowerCase();
  const activeStartup = startupData?.find((startup) => startup.id === startupId) ?? null;
  const matchedCollection = collections.find((entry) => {
    const collectionId = String(entry.id || '').toLowerCase();
    const collectionName = String(entry.collection_name || '').toLowerCase();
    return collectionId === normalizedCollection || collectionName === normalizedCollection;
  });
  const selectedCollectionId = matchedCollection?.id || collection || '';

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    price: '',
    status: 'Available',
    collection_id: selectedCollectionId,
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      startup_id: startupId || '',
      collection_id: selectedCollectionId,
    }));
  }, [startupId, selectedCollectionId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) {
      setImagePreview(null);
      setImageFile(null);
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startupId || !selectedCollectionId) {
      setErrorMessage('This item is missing its startup or collection context.');
      return;
    }

    if (!formData.price.trim() || !imageFile) {
      setErrorMessage('Please add the item image and price.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    const { data, error: insertError } = await supabase
      .from('collection_items')
      .insert([
        {
          name: imageFile?.name ? imageFile.name.replace(/\.[^/.]+$/, '') : 'Collection item',
          price: formData.price,
          status: formData.status || 'Available',
          collection_id: selectedCollectionId,
        },
      ])
      .select('id')
      .single();

    if (insertError) {
      setLoading(false);
      console.error('Error adding item to collection:', insertError);
      setErrorMessage('Unable to add item. Please try again.');
      return;
    }

    if (imageFile) {
      const insertImage = await imageHandlerService.cloudinaryImageUploader(
        imageFile,
        FOLDER.COLLECTION_ITEM,
        currentUser?.id || '',
        startupId,
        undefined,
        undefined,
        data?.id
      );

      if (!insertImage) {
        setLoading(false);
        setErrorMessage('Item saved but image upload failed. Please try again.');
        return;
      }
    }

    setLoading(false);
    setSubmitted(true);
    setFormData({
      price: '',
      status: 'Available',
      collection_id: selectedCollectionId,
    });
    setImageFile(null);
    setImagePreview(null);

    setTimeout(() => {
      setSubmitted(false);
      navigate(`/startup/${startupId}/catalog/${encodeURIComponent(collection || selectedCollectionId)}/${data.id}`);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <ScrollToTop />

      <main className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
          <div className="mb-8 flex items-center justify-between gap-3">
            <div>
              <h1 className="mt-2 text-3xl font-semibold text-slate-900">Add item to collection</h1>
              {activeStartup && (
                <p className="mt-2 text-sm text-slate-600">
                  Adding to <span className="font-semibold text-slate-800">{activeStartup.name}</span>
                </p>
              )}
              {matchedCollection && (
                <p className="mt-1 text-sm text-slate-500">
                  Collection: <span className="font-medium text-slate-700">{matchedCollection.collection_name}</span>
                </p>
              )}
            </div>

            <Link
              to={startupId ? `/startup/${startupId}/catalog/${encodeURIComponent(collection || selectedCollectionId)}` : '/'}
              className="text-sm font-medium text-slate-500 hover:text-slate-800"
            >
              Back to collection
            </Link>
          </div>

          {!startupId || !selectedCollectionId ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              This page needs a valid startup and collection to add an item.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="item-image" className="mb-2 block text-sm font-medium text-slate-700">
                  Item image
                </label>
                <div className="mt-1 rounded-xl border-2 border-dashed border-cyan-200 bg-cyan-50 p-4 text-center transition-colors hover:border-cyan-400">
                  <p className="mb-2 text-xs text-cyan-700">Upload a product image (PNG, JPG). Max 10MB.</p>
                  <input
                    id="item-image"
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="item-image"
                    className="inline-flex cursor-pointer items-center rounded-md border border-cyan-500 bg-white px-3 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-100"
                  >
                    Select Image
                  </label>
                </div>
                {imagePreview && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-slate-200">
                    <img src={imagePreview} alt="Preview" className="max-h-64 w-full object-cover" />
                    <p className="p-2 text-xs text-slate-500">Image preview</p>
                  </div>
                )}
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label htmlFor="price" className="mb-2 block text-sm font-medium text-slate-700">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="text"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 49.99"
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  />
                </div>

                <div>
                  <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-700">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-100"
                  >
                    <option value="Available">Available</option>
                    <option value="Booked">Booked</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {errorMessage && <p className="font-medium text-red-700">{errorMessage}</p>}

              {submitted ? (
                <SuccessMessage
                  header="Item added successfully!"
                  message="You will be redirected back to the collection shortly."
                  error={false}
                />
              ) : (
                <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/startup/${startupId}/catalog/${encodeURIComponent(collection || selectedCollectionId)}`)}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-cyan-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Adding...' : 'Add item'}
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
