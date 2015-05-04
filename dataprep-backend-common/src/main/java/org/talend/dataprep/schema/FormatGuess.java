package org.talend.dataprep.schema;

import org.talend.dataprep.api.dataset.ColumnMetadata;

/**
 * Represents a "guess" for a data set content format (e.g. CSV, Excel...).
 */
public interface FormatGuess {

    /**
     * @return The MIME type of the format guess.
     */
    String getMediaType();

    /**
     * @return A float between 0 and 1. 1 indicates guess is 100% sure, 0 indicates a certain 0%.
     */
    float getConfidence();

    /**
     * @return {@link org.talend.dataprep.schema.SchemaParser} that allowed data prep to read {@link ColumnMetadata
     * column metadata} information from the data set.
     * @see org.springframework.context.ApplicationContext#getBean(String)
     */
    SchemaParser getSchemaParser();

    /**
     * @return {@link org.talend.dataprep.schema.Serializer serializer} able to transform the underlying data set
     * content into JSON stream.
     * @see org.springframework.context.ApplicationContext#getBean(String)
     */
    Serializer getSerializer();

    String getBeanId();
}
