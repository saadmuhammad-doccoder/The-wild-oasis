// SUPABASE IMPORTS FOR QUERYING
import supabase, { supabaseUrl } from "./supabase";

// Function for querying the database for cabins
export async function getCabins() {
  // Query which returns data and error objects
  const { data, error } = await supabase.from("cabins").select("*");

  // if error exists it will throw the error
  if (error) {
    throw new Error("Cabins could not be loaded");
  }

  // return the data
  return data;
}

// Function for deleting Cabin from the database by passing the id of the cabin
export async function deleteCabin(id) {
  // Query which returns data and error objects after deleting the cabin
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  // If error exists, throw an error
  if (error) {
    throw new Error("Cabin could not be deleted");
  }

  // return the data
  return data;
}

// Function for editing existing cabin or creating new cabin
export async function createEditCabin(newCabin, id) {
  // https://gsvhvhogyaprlgijikln.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg

  // Boolean variable for checking if the newCabin passed to the function has the image and it contains supabaseUrl
  console.log(newCabin);
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Variable for creating new name for the uploaded image
  const imageName = `${Math.random()}-${newCabin.image.name}`.replaceAll(
    "/",
    ""
  );

  // Variable for deciding if the image is new or editing an existing cabin
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;

  // variable for creating the query
  let query = supabase.from("cabins");

  // if *id* is NOT passed to the function it will create a new cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);

  // if *id* is passed to the function it will edit an existing cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  // The query will instantly return a new cabin that is created or the edited one to keep the UI updated with the remote state
  const { data, error } = await query.select().single();

  // If error exists in creating new the function will throw new Error
  if (error) {
    throw new Error("Cabin could not be created");
  }

  if (hasImagePath) return data;

  // Query for uploading the images (FILES) to the supabase bucket which returns data and error in an object
  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // if storageError exists
  if (storageError) {
    // The new cabin created will be deleted and the cabin will be stopped form creating
    await supabase.from("cabins").delete().eq("id", data.id);

    // throws an error
    throw new Error(
      "Cabin image could not be uploaded and the cabin was not created."
    );
  }

  // returns the data
  return data;
}
