// ============================================================================
//
// Copyright (C) 2006-2015 Talend Inc. - www.talend.com
//
// This source code is available under agreement available at
// %InstallDIR%\features\org.talend.rcp.branding.%PRODUCTNAME%\%PRODUCTNAME%license.txt
//
// You should have received a copy of the agreement
// along with this program; if not, write to Talend SA
// 9 rue Pages 92150 Suresnes, France
//
// ============================================================================
package org.talend.dataprep.transformation.api.action.metadata.math;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.*;
import static org.talend.dataprep.api.dataset.ColumnMetadata.Builder.column;
import static org.talend.dataprep.transformation.api.action.metadata.ActionMetadataTestUtils.getColumn;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.junit.Before;
import org.junit.Test;
import org.talend.dataprep.api.dataset.ColumnMetadata;
import org.talend.dataprep.api.dataset.DataSetRow;
import org.talend.dataprep.api.preparation.Action;
import org.talend.dataprep.api.type.Type;
import org.talend.dataprep.transformation.api.action.DataSetRowAction;
import org.talend.dataprep.transformation.api.action.context.TransformationContext;
import org.talend.dataprep.transformation.api.action.metadata.ActionMetadataTestUtils;
import org.talend.dataprep.transformation.api.action.metadata.category.ActionCategory;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.talend.dataprep.transformation.api.action.metadata.column.CopyColumnMetadata;

/**
 * Unit test for the absolute actions.
 *
 * @see AbsoluteFloat
 * @see AbsoluteFloat
 */
public class AbsoluteTest {

    private static final String FLOAT_COLUMN = "float_column"; //$NON-NLS-1$

    private static final String INT_COLUMN = "int_column"; //$NON-NLS-1$

    private AbsoluteFloat absFloatAction;

    private AbsoluteInt absIntAction;

    private Map<String, String> absFloatParameters;
    private Map<String, String> absIntParameters;

    @Before
    public void init() throws IOException {
        absFloatAction = new AbsoluteFloat();
        absIntAction = new AbsoluteInt();

        absFloatParameters = ActionMetadataTestUtils.parseParameters( //
                absFloatAction, //
                AbsoluteFloat.class.getResourceAsStream("absoluteFloatAction.json"));
        absIntParameters = ActionMetadataTestUtils.parseParameters( //
                absIntAction, //
                AbsoluteInt.class.getResourceAsStream("absoluteIntAction.json"));
    }

    @Test
    public void testAdaptFloat() throws Exception {
        assertThat(absFloatAction.adapt(null), is(absFloatAction));
        ColumnMetadata column = column().name("myColumn").id(0).type(Type.STRING).build();
        assertThat(absFloatAction.adapt(column), is(absFloatAction));
    }

    @Test
    public void testAdaptInt() throws Exception {
        assertThat(absIntAction.adapt(null), is(absIntAction));
        ColumnMetadata column = column().name("myColumn").id(0).type(Type.STRING).build();
        assertThat(absIntAction.adapt(column), is(absIntAction));
    }

    @Test
    public void testCategory() throws Exception {
        assertThat(absIntAction.getCategory(), is(ActionCategory.MATH.getDisplayName()));
        assertThat(absFloatAction.getCategory(), is(ActionCategory.MATH.getDisplayName()));
    }

    @Test
    public void testAbsoluteFloatWithPositiveFloat() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "5.42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("5.42", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithPositiveFloat() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "5.42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("5.42", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithNegativeFloat() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "-5.42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("5.42", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithNegativeFloat() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "-5.42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("5.42", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithPositiveInt() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("42", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithPositiveInt() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "42"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("42", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithNegativeInt() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "-542"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("542", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithNegativeInt() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "-542"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("542", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithNegativeZero() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "-0"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("0", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithNegativeZero() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "-0"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("0", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithEmpty() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, ""); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithEmpty() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, ""); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithNonNumeric() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(FLOAT_COLUMN, "foobar"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("foobar", row.get(FLOAT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteIntWithNonNumeric() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put(INT_COLUMN, "foobar"); //$NON-NLS-1$
        final DataSetRow row = new DataSetRow(values);

        //when
        absIntAction.applyOnColumn(row, new TransformationContext(), absIntParameters, "int_column");

        //then
        assertEquals("foobar", row.get(INT_COLUMN)); //$NON-NLS-1$
    }

    @Test
    public void testAbsoluteFloatWithMissingColumn() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put("wrong_column", "-12"); //$NON-NLS-1$ //$NON-NLS-2$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("-12", row.get("wrong_column")); //$NON-NLS-1$ //$NON-NLS-2$
    }

    @Test
    public void testAbsoluteIntWithMissingColumn() {
        //given
        final Map<String, String> values = new HashMap<>();
        values.put("wrong_column", "-13"); //$NON-NLS-1$ //$NON-NLS-2$
        final DataSetRow row = new DataSetRow(values);

        //when
        absFloatAction.applyOnColumn(row, new TransformationContext(), absFloatParameters, "float_column");

        //then
        assertEquals("-13", row.get("wrong_column")); //$NON-NLS-1$ //$NON-NLS-2$
    }

    @Test
    public void should_accept_column() {
        assertTrue(absIntAction.acceptColumn(getColumn(Type.INTEGER)));
        assertTrue(absFloatAction.acceptColumn(getColumn(Type.FLOAT)));
        assertTrue(absFloatAction.acceptColumn(getColumn(Type.DOUBLE)));
    }

    @Test
    public void should_not_accept_column() {
        assertFalse(absIntAction.acceptColumn(getColumn(Type.NUMERIC)));
        assertFalse(absIntAction.acceptColumn(getColumn(Type.DOUBLE)));
        assertFalse(absIntAction.acceptColumn(getColumn(Type.FLOAT)));
        assertFalse(absIntAction.acceptColumn(getColumn(Type.STRING)));
        assertFalse(absIntAction.acceptColumn(getColumn(Type.DATE)));
        assertFalse(absIntAction.acceptColumn(getColumn(Type.BOOLEAN)));

        assertFalse(absFloatAction.acceptColumn(getColumn(Type.NUMERIC)));
        assertFalse(absFloatAction.acceptColumn(getColumn(Type.INTEGER)));
        assertFalse(absFloatAction.acceptColumn(getColumn(Type.STRING)));
        assertFalse(absFloatAction.acceptColumn(getColumn(Type.DATE)));
        assertFalse(absFloatAction.acceptColumn(getColumn(Type.BOOLEAN)));

    }
}
